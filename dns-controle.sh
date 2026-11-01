#!/usr/bin/env bash
# Flow8 — DNS natellen na een wijziging bij Strato.
#
# Vergelijkt de huidige records met wat ze na de verhuizing MOETEN zijn. De mailregels zijn
# het belangrijkst: die horen onveranderd te blijven. Zie VERHUIZING-FLOW8.md voor de
# nulmeting van 1 november 2026.
#
# Gebruik: ./dns-controle.sh

set -u
DOMEIN=${1:-flow-8.nl}
CLOUD86=45.82.191.90
OUD_A=217.160.0.138

groen() { printf '  \033[32mgoed\033[0m  %s\n' "$1"; }
rood()  { printf '  \033[31mFOUT\033[0m  %s\n' "$1"; FOUTEN=$((FOUTEN+1)); }
grijs() { printf '  ----  %s\n' "$1"; }
FOUTEN=0

echo "═══ $DOMEIN — $(date '+%Y-%m-%d %H:%M') ═══"
echo
echo "Website — moet naar Cloud86 wijzen"

a=$(dig +short A "$DOMEIN" | tr '\n' ' ' | xargs)
[ "$a" = "$CLOUD86" ] && groen "A        $a" \
  || { [ "$a" = "$OUD_A" ] && grijs "A        $a  (nog het oude Strato-adres — nog niet omgezet)" \
       || rood "A        $a  (verwacht $CLOUD86)"; }

aaaa=$(dig +short AAAA "$DOMEIN" | tr '\n' ' ' | xargs)
[ -z "$aaaa" ] && groen "AAAA     weg" || rood "AAAA     $aaaa  (hoort weg te zijn, anders gaat IPv6 nog naar Strato)"

w=$(dig +short A "www.$DOMEIN" | tail -1)
[ "$w" = "$CLOUD86" ] && groen "www      $w" || grijs "www      $w"

ap=$(dig +short A "app.$DOMEIN" | tail -1)
[ "$ap" = "$CLOUD86" ] && groen "app      $ap" || rood "app      ${ap:-ontbreekt}  (verwacht $CLOUD86)"

echo
echo "Mail — moet ONVERANDERD zijn"

mx=$(dig +short MX "$DOMEIN" | tr '\n' ' ' | xargs)
[ "$mx" = "5 smtp.rzone.de." ] && groen "MX       $mx" || rood "MX       $mx  (verwacht: 5 smtp.rzone.de.)"

for s in strato-dkim-0002 strato-dkim-0003; do
  d=$(dig +short TXT "$s._domainkey.$DOMEIN")
  [ -n "$d" ] && groen "DKIM     $s aanwezig" || rood "DKIM     $s WEG"
done

dm=$(dig +short TXT "_dmarc.$DOMEIN")
[ -n "$dm" ] && groen "DMARC    $dm" || rood "DMARC    weg"

spf=$(dig +short TXT "$DOMEIN")
[ -z "$spf" ] && grijs "SPF      geen — klopt tot ronde 3, maar LET OP: met DMARC op reject" \
             || grijs "SPF      $spf"
[ -z "$spf" ] && grijs "         wordt Resend-mail geweigerd zolang SPF en DKIM ontbreken."

echo
echo "Naamservers — moeten bij Strato blijven"
ns=$(dig +short NS "$DOMEIN" | sort | tr '\n' ' ' | xargs)
case "$ns" in *rzone.de*) groen "NS       $ns" ;; *) rood "NS       $ns  (verwacht rzone.de — niet verzetten!)" ;; esac

echo
echo "Bereikbaarheid"
for h in "$DOMEIN" "app.$DOMEIN"; do
  code=$(curl -sS -m 20 -o /dev/null -w "%{http_code}" "https://$h/?a=$RANDOM" 2>/dev/null)
  case "$code" in
    200)    groen "https://$h  HTTP 200" ;;
    000|"") rood  "https://$h  geen verbinding, of het certificaat klopt nog niet" ;;
    *)      rood  "https://$h  HTTP $code" ;;
  esac
done

echo
[ "$FOUTEN" -eq 0 ] && echo "Alles zoals verwacht." || echo "$FOUTEN punt(en) om naar te kijken."
exit 0

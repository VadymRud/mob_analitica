## General strategy structure

### Processing steps

    0. Check signal with indicators
    1. Check position
    2. Money Management
    3. Money Allocation
    4. Order Managment
    5. Risk Control


### MSq internal strategy signals

Signal definition

    no signal        (or "doNothing", or "")

    "buy"            (works as enter or exit depending on the current position)
    "buyStrong"      (works as enter or reverse or reenter depending on the current position)
    "sell"           (works as enter or exit depending on the current position)
    "sellStrong"     (works as enter or reverse or reenter depending on the current position)

Position constrains (corresponding signal is symmetric if it isn't defined)

    "flat"           (corresponding signal works in flat position only)
    "long"           (corresponding signal works in long position only)
    "short"          (corresponding signal works in short position only)  
          

### MSq Strategy Builder signals

Group "Entry"

    "Entry Buy"  --> action: "buyStrong"  (works as enter or reverse depending on the current position)
    "Entry Sell" --> action: "sellStrong" (works as enter or reverse depending on the current position)

Group "Exit"

    "Exit Buy"   --> action: "sell" / from: "long"
    "Exit Sell"  --> action: "buy"  / from: "short"


### Third-party strategies signals

We can interprete signals from third-party strategies the following way:

    "buyShort"       --> "sell"       / "flat"
    "reverseToShort" --> "sellStrong" / "long"
    "sellLong"       --> "sell"       / "long"
    "buyShortStrong" --> "sellStrong"

    "buyLong"        --> "buy"        / "flat"
    "reverseToLong"  --> "buyStrong"  / "short"
    "sellShort"      --> "buy"        / "short"
    "buyLongStrong"  --> "buyStrong"

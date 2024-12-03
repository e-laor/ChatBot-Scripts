# Custom Scripts for Firebot

## WRCommand

Make sure to set up a conditional effect in the following order:

- Make a command trigger (e.g. !wr) with a cooldown of 5 seconds globally (recommended).
- Add Conditional Effects as follows:
  **If any of the following conditions pass**

  1. Condition #1
     `TYPE: Command Args Count`
     `COMPARATOR: is less than`
     `EXPECTED VALUE` **1**

  2. Condition #2
     `TYPE: Custom`**$arg[1]**
     `COMPARATOR: does not match regex`
     `EXPECTED VALUE` **\b(s[1-5])\b**

  Then the command was not used in the correct form (e.g. !wr s1)

  **Otherwise**
  `Run` the custom Script, the result will be stored in a **custom variable** called `wrHolder` for the next 5 seconds.
  You can send it as a chat message using `$customVariable[wrHolder]`

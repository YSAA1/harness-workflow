# Smell baseline

> Used by `review` step 2. Entries from Fowler, *Refactoring*, ch. 3; organisation adapted from [mattpocock/skills](https://github.com/mattpocock/skills) `code-review` (MIT), revision `b0618bc` (2026-10-08).

Two rules bind it:

- **The repo overrides**: a documented repo standard always wins; where it endorses something the baseline would flag, suppress the smell.
- **Always a judgement call**: each smell is a labelled heuristic ("possible Feature Envy"), never a hard violation; skip anything tooling already enforces.

Each entry reads **what it is** → **how to fix**; match it against the diff:

- **Mysterious Name**: a function, variable, or type whose name doesn't reveal what it does or holds → rename it; if no honest name comes, the design is murky.
- **Duplicated Code**: the same logic shape appears in more than one hunk or file of the change → extract the shared shape, call it from both.
- **Feature Envy**: a method reaching into another object's data more than its own → move the method onto the data it envies.
- **Data Clumps**: the same few fields or params keep travelling together (a type wanting to be born) → bundle them into one type, pass that.
- **Primitive Obsession**: a primitive or string standing in for a domain concept that deserves its own type → give the concept its own small type.
- **Repeated Switches**: the same `switch`/`if` cascade on the same type recurs across the change → replace with polymorphism, or one map both sites share.
- **Shotgun Surgery**: one logical change forces scattered edits across many files in the diff → gather what changes together into one module.
- **Divergent Change**: one file or module edited for several unrelated reasons → split so each module changes for one reason.
- **Speculative Generality**: abstraction, parameters, or hooks for needs the requirements don't have → delete it; inline back until a real need shows.
- **Message Chains**: a caller depending on long `a.b().c().d()` navigation → hide the walk behind one method on the first object.
- **Middle Man**: a class or function that mostly delegates onward → cut it, call the real target directly.
- **Refused Bequest**: a subclass or implementer ignoring or overriding most of what it inherits → drop the inheritance, use composition.

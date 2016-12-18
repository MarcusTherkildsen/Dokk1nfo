# Dokk1nfo
Source code for the [dokk1nfo.dk](www.dokk1nfo.dk) website

This website was created out of my own frustation of not being able to find items at the largest public library in Scandinavia, [dokk1](https://en.wikipedia.org/wiki/Dokk1#Library_and_culture_center).

Dokk1nfo.dk solves this problem by generating a map for the user, indicating the exact shelve(s) the item is positioned on.

Simply search for an item
![alt tag](https://www.mtherkildsen.dk/bl-content/uploads/figures/bib_related/search_results.png)
and then click on the one you want
![alt tag](https://www.mtherkildsen.dk/bl-content/uploads/figures/bib_related/map.png)

TODO:
- Look into where stuff goes wrong with the new system. Use "turen går til" as a test case since that does not work anymore. 
- See if we can use more direct calls to aakb.dk since we are now whitelisted. 
- Decide whether to move everything to serverside or not. 

DONE:
- Get current dokk1nfo code on github.
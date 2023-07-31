1. Poceo sam da radim kao da delete i insert poziva metodu iz servisa, gde metoda iz servisa vraca boolean (ako je true, uspesno izvrsena metoda,
ako je false, greska neka).


METODA KONTROLERA{

			bool						
 SERVISNA METODA --------------> ISPRAVNO IZVRSENA ----------> Ok result
										NEISPRAVNO IZVRSENA --------->BadRequest

}

Zaboravi ovo, sad radim da ako upis ili update ne valja, da se baci Exception
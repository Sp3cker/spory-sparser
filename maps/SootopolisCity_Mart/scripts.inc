# 1 "data/maps/SootopolisCity_Mart/scripts.pory"

# 2 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_MapScripts::
# 3 "data/maps/SootopolisCity_Mart/scripts.pory"
	.byte 0
# 4 "data/maps/SootopolisCity_Mart/scripts.pory"

# 5 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_EventScript_Clerk::
# 6 "data/maps/SootopolisCity_Mart/scripts.pory"
	lock
# 7 "data/maps/SootopolisCity_Mart/scripts.pory"
	faceplayer
# 8 "data/maps/SootopolisCity_Mart/scripts.pory"
	message gText_HowMayIServeYou
# 9 "data/maps/SootopolisCity_Mart/scripts.pory"
	waitmessage
# 10 "data/maps/SootopolisCity_Mart/scripts.pory"
	pokemart SootopolisCity_Mart_Pokemart
# 11 "data/maps/SootopolisCity_Mart/scripts.pory"
	msgbox gText_PleaseComeAgain, MSGBOX_DEFAULT
# 12 "data/maps/SootopolisCity_Mart/scripts.pory"
	release
# 13 "data/maps/SootopolisCity_Mart/scripts.pory"
	end
# 14 "data/maps/SootopolisCity_Mart/scripts.pory"

# 15 "data/maps/SootopolisCity_Mart/scripts.pory"
	.align 2
# 16 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_Pokemart:
# 17 "data/maps/SootopolisCity_Mart/scripts.pory"
	.2byte ITEM_ULTRA_BALL
# 18 "data/maps/SootopolisCity_Mart/scripts.pory"
	.2byte ITEM_HYPER_POTION
# 19 "data/maps/SootopolisCity_Mart/scripts.pory"
	.2byte ITEM_MAX_POTION
# 20 "data/maps/SootopolisCity_Mart/scripts.pory"
	.2byte ITEM_FULL_HEAL
# 21 "data/maps/SootopolisCity_Mart/scripts.pory"
	.2byte ITEM_REVIVE
# 22 "data/maps/SootopolisCity_Mart/scripts.pory"
	.2byte ITEM_MAX_REPEL
# 23 "data/maps/SootopolisCity_Mart/scripts.pory"
	.2byte ITEM_X_ATTACK
# 24 "data/maps/SootopolisCity_Mart/scripts.pory"
	.2byte ITEM_X_DEFENSE
# 25 "data/maps/SootopolisCity_Mart/scripts.pory"
	.2byte ITEM_SHADOW_MAIL
# 26 "data/maps/SootopolisCity_Mart/scripts.pory"
	.2byte ITEM_NONE
# 27 "data/maps/SootopolisCity_Mart/scripts.pory"
	release
# 28 "data/maps/SootopolisCity_Mart/scripts.pory"
	end
# 29 "data/maps/SootopolisCity_Mart/scripts.pory"

# 30 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_EventScript_FatMan::
# 31 "data/maps/SootopolisCity_Mart/scripts.pory"
	lock
# 32 "data/maps/SootopolisCity_Mart/scripts.pory"
	faceplayer
# 33 "data/maps/SootopolisCity_Mart/scripts.pory"
	goto_if_ge VAR_SKY_PILLAR_STATE, 2, SootopolisCity_Mart_EventScript_FatManNoLegendaries
# 34 "data/maps/SootopolisCity_Mart/scripts.pory"
	goto_if_unset FLAG_KYOGRE_ESCAPED_SEAFLOOR_CAVERN, SootopolisCity_Mart_EventScript_FatManNoLegendaries
# 35 "data/maps/SootopolisCity_Mart/scripts.pory"
	msgbox SootopolisCity_Mart_Text_TooScaryOutside, MSGBOX_DEFAULT
# 36 "data/maps/SootopolisCity_Mart/scripts.pory"
	release
# 37 "data/maps/SootopolisCity_Mart/scripts.pory"
	end
# 38 "data/maps/SootopolisCity_Mart/scripts.pory"

# 39 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_EventScript_FatManNoLegendaries::
# 40 "data/maps/SootopolisCity_Mart/scripts.pory"
	msgbox SootopolisCity_Mart_Text_PPUpIsGreat, MSGBOX_DEFAULT
# 41 "data/maps/SootopolisCity_Mart/scripts.pory"
	release
# 42 "data/maps/SootopolisCity_Mart/scripts.pory"
	end
# 43 "data/maps/SootopolisCity_Mart/scripts.pory"

# 44 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_EventScript_Gentleman::
# 45 "data/maps/SootopolisCity_Mart/scripts.pory"
	lock
# 46 "data/maps/SootopolisCity_Mart/scripts.pory"
	faceplayer
# 47 "data/maps/SootopolisCity_Mart/scripts.pory"
	goto_if_ge VAR_SKY_PILLAR_STATE, 2, SootopolisCity_Mart_EventScript_GentlemanNoLegendaries
# 48 "data/maps/SootopolisCity_Mart/scripts.pory"
	goto_if_unset FLAG_KYOGRE_ESCAPED_SEAFLOOR_CAVERN, SootopolisCity_Mart_EventScript_GentlemanNoLegendaries
# 49 "data/maps/SootopolisCity_Mart/scripts.pory"
	msgbox SootopolisCity_Mart_Text_DidSomethingAwaken, MSGBOX_DEFAULT
# 50 "data/maps/SootopolisCity_Mart/scripts.pory"
	release
# 51 "data/maps/SootopolisCity_Mart/scripts.pory"
	end
# 52 "data/maps/SootopolisCity_Mart/scripts.pory"

# 53 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_EventScript_GentlemanNoLegendaries::
# 54 "data/maps/SootopolisCity_Mart/scripts.pory"
	msgbox SootopolisCity_Mart_Text_FullRestoreItemOfDreams, MSGBOX_DEFAULT
# 55 "data/maps/SootopolisCity_Mart/scripts.pory"
	release
# 56 "data/maps/SootopolisCity_Mart/scripts.pory"
	end
# 57 "data/maps/SootopolisCity_Mart/scripts.pory"

# 58 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_Text_PPUpIsGreat:
# 59 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "PP UP is great!\p"
# 60 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "It raises the POWER POINTS, the PP,\n"
# 61 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "of a Pokémon move.$"
# 62 "data/maps/SootopolisCity_Mart/scripts.pory"

# 63 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_Text_TooScaryOutside:
# 64 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "What…\n"
# 65 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "What is happening?\p"
# 66 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "I really want to know, but it's too\n"
# 67 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "scary to go outside.$"
# 68 "data/maps/SootopolisCity_Mart/scripts.pory"

# 69 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_Text_FullRestoreItemOfDreams:
# 70 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "Do you know FULL RESTORE?\p"
# 71 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "Full restoration of HP!\n"
# 72 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "Eradication of all status problems!\p"
# 73 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "It's truly an item of your dreams!$"
# 74 "data/maps/SootopolisCity_Mart/scripts.pory"

# 75 "data/maps/SootopolisCity_Mart/scripts.pory"
SootopolisCity_Mart_Text_DidSomethingAwaken:
# 76 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "This weather…\n"
# 77 "data/maps/SootopolisCity_Mart/scripts.pory"
	.string "Did something awaken?$"

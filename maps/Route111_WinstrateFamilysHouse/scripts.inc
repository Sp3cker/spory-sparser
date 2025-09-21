# 1 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 2 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
.set LOCALID_VIVI, 1
# 3 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
.set LOCALID_VICTOR, 2
# 4 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
.set LOCALID_VICTORIA, 3
# 5 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
.set LOCALID_VICKY, 4
# 6 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 7 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_MapScripts::
# 8 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.byte 0
# 9 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 10 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_EventScript_Victor::
# 11 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	lock
# 12 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	faceplayer
# 13 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	setvar VAR_0x8008, LOCALID_VICTOR
# 14 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto_if_set FLAG_IS_CHAMPION, Route111_WinstrateFamilysHouse_GiveMysticTicket
# 15 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_MySonIsStrongerThanYou, MSGBOX_DEFAULT
# 16 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto Route111_WinstrateFamilysHouse_EventScript_FaceOriginalDirection
# 17 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	end
# 18 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 19 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_GiveMysticTicket::
@explanation (Post Game) Speak to the Winstrate Family
# 20 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto_if_set FLAG_ENABLE_SHIP_BIRTH_ISLAND, Route111_WinstrateFamilysHouse_AlreadyGaveMysticTicket
# 21 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_TakeMysticTicket, MSGBOX_DEFAULT
# 22 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitem ITEM_MYSTIC_TICKET
# 23 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitem ITEM_AURORA_TICKET
# 24 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitem ITEM_EON_TICKET
# 25 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	setflag FLAG_ENABLE_SHIP_NAVEL_ROCK
# 26 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	setflag FLAG_ENABLE_SHIP_SOUTHERN_ISLAND
# 27 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	setflag FLAG_ENABLE_SHIP_BIRTH_ISLAND
# 28 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_BeSafeTicket, MSGBOX_DEFAULT
# 29 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto Route111_WinstrateFamilysHouse_EventScript_FaceOriginalDirection
# 30 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	end
# 31 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 32 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_AlreadyGaveMysticTicket::
# 33 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_BeSafeTicket, MSGBOX_DEFAULT
# 34 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto Route111_WinstrateFamilysHouse_EventScript_FaceOriginalDirection
# 35 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	end
# 36 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 37 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_EventScript_Victoria::
@explanation Defeat Victoria at the Winstrate Family House
# 38 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	lock
# 39 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	faceplayer
# 40 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	setvar VAR_0x8008, LOCALID_VICTORIA
# 41 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto_if_set FLAG_RECEIVED_MEGA_STONES, Route111_WinstrateFamilysHouse_EventScript_ReceivedMegaStones
# 42 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_LikeYouToHaveMegaStones, MSGBOX_DEFAULT
# 43 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_ALAKAZITE
# 44 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_KANGASKHANITE
# 45 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_AUDINITE
# 46 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_GARDEVOIRITE
# 47 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_ABSOLITE
# 48 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_SHARPEDONITE
# 49 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_HERACRONITE
# 50 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_LOPUNNITE
# 51 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_PIDGEOTITE
# 52 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_BEEDRILLITE
# 53 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_GLALITITE
# 54 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_ABOMASITE
# 55 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_MEDICHAMITE
# 56 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_AGGRONITE
# 57 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_CAMERUPTITE
# 58 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_MAWILITE
# 59 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_HOUNDOOMINITE
# 60 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_PINSIRITE
# 61 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_COALOSSITE
# 62 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_SLOWBRONITE
# 63 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_ORBEETLITE
# 64 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_SCIZORITE
# 65 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_AERODACTYLITE
# 66 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_GALLADITE
# 67 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_CENTISKITE
# 68 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_SANDACONDITE
# 69 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	giveitemfast ITEM_APPLITE
# 70 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	setflag FLAG_RECEIVED_MEGA_STONES
# 71 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	playfanfare MUS_OBTAIN_ITEM
# 72 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_ReceivedSeveralMegaStones, MSGBOX_DEFAULT
# 73 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	waitfanfare
# 74 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_ExplainMegaStones, MSGBOX_DEFAULT
# 75 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto Route111_WinstrateFamilysHouse_EventScript_FaceOriginalDirection
# 76 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	end
# 77 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 78 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_EventScript_ReceivedMegaStones::
# 79 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_PassionateAboutBattles, MSGBOX_DEFAULT
# 80 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto Route111_WinstrateFamilysHouse_EventScript_FaceOriginalDirection
# 81 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	end
# 82 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 83 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_EventScript_Vivi::
# 84 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	lock
# 85 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	faceplayer
# 86 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	setvar VAR_0x8008, LOCALID_VIVI
# 87 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_StrongerFamilyMembers, MSGBOX_DEFAULT
# 88 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto Route111_WinstrateFamilysHouse_EventScript_FaceOriginalDirection
# 89 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	end
# 90 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 91 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_EventScript_Vicky::
# 92 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	lock
# 93 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	faceplayer
# 94 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	setvar VAR_0x8008, LOCALID_VICKY
# 95 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto_if_set FLAG_TEMP_4, Route111_WinstrateFamilysHouse_EventScript_AlreadySpokenTo
# 96 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_GrandsonStrong, MSGBOX_DEFAULT
# 97 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	setflag FLAG_TEMP_4
# 98 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto Route111_WinstrateFamilysHouse_EventScript_FaceOriginalDirection
# 99 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	end
# 100 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 101 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_EventScript_AlreadySpokenTo::
# 102 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	msgbox Route111_WinstrateFamilysHouse_Text_GrandsonStrongShort, MSGBOX_DEFAULT
# 103 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	goto Route111_WinstrateFamilysHouse_EventScript_FaceOriginalDirection
# 104 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	end
# 105 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 106 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_EventScript_FaceOriginalDirection::
# 107 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	closemessage
# 108 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	applymovement VAR_0x8008, Common_Movement_FaceOriginalDirection
# 109 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	waitmovement 0
# 110 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	release
# 111 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	end
# 112 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 113 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_Text_MySonIsStrongerThanYou:
# 114 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "You're the first trainer I've seen who\n"
# 115 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "deploys Pokémon so masterfully.\p"
# 116 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "But, I should tell you--my son is\n"
# 117 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "stronger than you.\p"
# 118 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "He even took the Pokémon League\n"
# 119 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "challenge, I'll have you know.$"
# 120 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 121 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_Text_TakeMysticTicket:
# 122 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Oh my, you took on the Pokémon League?\n"
# 123 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "And you won?!\p"
# 124 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Not even my son was strong enough to\n"
# 125 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "do that…\p"
# 126 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "I was going to give this to my son once\n"
# 127 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "he became the Champion, but since you\l"
# 128 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "beat him to it…\p"
# 129 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Here, take this, I've been holding onto\n"
# 130 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "it for too long, and I'm afraid it will\l"
# 131 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "never get used at this rate.$"
# 132 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 133 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_Text_BeSafeTicket:
# 134 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "I've always wondered where that\n"
# 135 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "ticket leads.\p"
# 136 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Be safe out there, new Champion.$"
# 137 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 138 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_Text_LikeYouToHaveMegaStones:
# 139 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "We've got a nice collection of Mega\n"
# 140 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Stones amassed here.\p"
# 141 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "We gave one set to my son when he went\n"
# 142 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "to go take on the Elite 4.\p"
# 143 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "I'm not sure I believe you're as strong\n"
# 144 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "as he is, but they may prove helpful to\l"
# 145 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "you anyway.$"
# 146 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 147 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_Text_PassionateAboutBattles:
# 148 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "When it comes to Pokémon battles,\n"
# 149 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "we tend to be pretty passionate.$"
# 150 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 151 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_Text_StrongerFamilyMembers:
# 152 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Mommy is stronger than Daddy.\p"
# 153 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "I'm stronger than Mommy.\p"
# 154 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "And Grandma's stronger than me!\p"
# 155 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "But my big brother is even stronger\n"
# 156 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "than Grandma.$"
# 157 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 158 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_Text_GrandsonStrong:
# 159 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "There's no question that you're strong.\p"
# 160 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "But if you were to battle my grandson,\n"
# 161 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "you'd end up crying in frustration.\p"
# 162 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "He's much stronger than any trainer\n"
# 163 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "our family knows.\p"
# 164 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "He must be challenging the Pokémon\n"
# 165 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "League Champion by now.\p"
# 166 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Knowing my grandson, he could be the\n"
# 167 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Champion already!$"
# 168 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 169 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_Text_GrandsonStrongShort:
# 170 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "My grandson must be challenging the\n"
# 171 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Pokémon League Champion by now.\p"
# 172 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Knowing my grandson, he could be the\n"
# 173 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Champion already!$"
# 174 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 175 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_Text_ReceivedSeveralMegaStones::
# 176 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "{PLAYER} received several Mega Stones!$"
# 177 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"

# 178 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
Route111_WinstrateFamilysHouse_Text_ExplainMegaStones:
# 179 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Those are all the Mega Stones that we\n"
# 180 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "have collected, which included the:\p"
# 181 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Alakazite, Kangaskhanite, Audinite,\n"
# 182 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Gardevoirite, Absolite, Sharpedonite,\l"
# 183 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Heracronite, Lopunnite, Pidgeotite,\l"
# 184 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Beedrillite, Glalite, Abomasite,\l"
# 185 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Medichamite, Aggronite, Cameruptite,\l"
# 186 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Mawilite, Houndoominite, Pinsirite,\l"
# 187 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Coalossite, Slowbronite, Orbeetlite,\l"
# 188 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Scizorite, Aerodactylite, Galladite,\l"
# 189 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Centiskite, Sandacondite, and Applite.\p"
# 190 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "Surely, those will make you a more\n"
# 191 "data/maps/Route111_WinstrateFamilysHouse/scripts.pory"
	.string "powerful trainer.$"

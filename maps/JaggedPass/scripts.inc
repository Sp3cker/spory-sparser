# 1 "data/maps/JaggedPass/scripts.pory"

# 2 "data/maps/JaggedPass/scripts.pory"
.set LOCALID_HIDEOUT_GUARD, 5
# 3 "data/maps/JaggedPass/scripts.pory"

# 4 "data/maps/JaggedPass/scripts.pory"
JaggedPass_MapScripts::
# 5 "data/maps/JaggedPass/scripts.pory"
	map_script MAP_SCRIPT_ON_RESUME, JaggedPass_OnResume
# 6 "data/maps/JaggedPass/scripts.pory"
	map_script MAP_SCRIPT_ON_TRANSITION, JaggedPass_OnTransition
# 7 "data/maps/JaggedPass/scripts.pory"
	map_script MAP_SCRIPT_ON_LOAD, JaggedPass_OnLoad
# 8 "data/maps/JaggedPass/scripts.pory"
	.byte 0
# 9 "data/maps/JaggedPass/scripts.pory"

# 10 "data/maps/JaggedPass/scripts.pory"
JaggedPass_OnResume:
# 11 "data/maps/JaggedPass/scripts.pory"
	setstepcallback STEP_CB_ASH
# 12 "data/maps/JaggedPass/scripts.pory"
	call_if_eq VAR_JAGGED_PASS_STATE, 0, JaggedPass_EventScript_CheckHasMagmaEmblem
# 13 "data/maps/JaggedPass/scripts.pory"
	end
# 14 "data/maps/JaggedPass/scripts.pory"

# 15 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_CheckHasMagmaEmblem::
# 16 "data/maps/JaggedPass/scripts.pory"
	checkitem ITEM_MAGMA_EMBLEM
# 17 "data/maps/JaggedPass/scripts.pory"
	goto_if_eq VAR_RESULT, TRUE, JaggedPass_EventScript_SetReadyToOpenHideout
# 18 "data/maps/JaggedPass/scripts.pory"
	return
# 19 "data/maps/JaggedPass/scripts.pory"

# 20 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_SetReadyToOpenHideout::
# 21 "data/maps/JaggedPass/scripts.pory"
	setvar VAR_JAGGED_PASS_STATE, 1
# 22 "data/maps/JaggedPass/scripts.pory"
	return
# 23 "data/maps/JaggedPass/scripts.pory"

# 24 "data/maps/JaggedPass/scripts.pory"
JaggedPass_OnTransition:
# 25 "data/maps/JaggedPass/scripts.pory"
	call_if_eq VAR_JAGGED_PASS_ASH_WEATHER, 1, JaggedPass_EventScript_SetWeatherAsh
# 26 "data/maps/JaggedPass/scripts.pory"
	end
# 27 "data/maps/JaggedPass/scripts.pory"

# 28 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_SetWeatherAsh::
# 29 "data/maps/JaggedPass/scripts.pory"
	setweather WEATHER_VOLCANIC_ASH
# 30 "data/maps/JaggedPass/scripts.pory"
	doweather
# 31 "data/maps/JaggedPass/scripts.pory"
	return
# 32 "data/maps/JaggedPass/scripts.pory"

# 33 "data/maps/JaggedPass/scripts.pory"
JaggedPass_OnLoad:
# 34 "data/maps/JaggedPass/scripts.pory"
	goto_if_le VAR_JAGGED_PASS_STATE, 1, JaggedPass_EventScript_ConcealHideoutEntrance
# 35 "data/maps/JaggedPass/scripts.pory"
	end
# 36 "data/maps/JaggedPass/scripts.pory"

# 37 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_ConcealHideoutEntrance::
# 38 "data/maps/JaggedPass/scripts.pory"
	setmetatile 16, 17, METATILE_Lavaridge_RockWall, TRUE
# 39 "data/maps/JaggedPass/scripts.pory"
	setmetatile 16, 18, METATILE_Lavaridge_RockWall, TRUE
# 40 "data/maps/JaggedPass/scripts.pory"
	end
# 41 "data/maps/JaggedPass/scripts.pory"

# 42 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_OpenMagmaHideout::
# 43 "data/maps/JaggedPass/scripts.pory"
	lockall
# 44 "data/maps/JaggedPass/scripts.pory"
	setvar VAR_0x8004, 1  @ vertical pan
# 45 "data/maps/JaggedPass/scripts.pory"
	setvar VAR_0x8005, 1  @ horizontal pan
# 46 "data/maps/JaggedPass/scripts.pory"
	setvar VAR_0x8006, 8  @ num shakes
# 47 "data/maps/JaggedPass/scripts.pory"
	setvar VAR_0x8007, 5  @ shake delay
# 48 "data/maps/JaggedPass/scripts.pory"
	special ShakeCamera
# 49 "data/maps/JaggedPass/scripts.pory"
	waitstate
# 50 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_BoulderShakingInResponseToEmblem, MSGBOX_DEFAULT
# 51 "data/maps/JaggedPass/scripts.pory"
	closemessage
# 52 "data/maps/JaggedPass/scripts.pory"
	setvar VAR_0x8004, 1   @ vertical pan
# 53 "data/maps/JaggedPass/scripts.pory"
	setvar VAR_0x8005, 1   @ horizontal pan
# 54 "data/maps/JaggedPass/scripts.pory"
	setvar VAR_0x8006, 16  @ num shakes
# 55 "data/maps/JaggedPass/scripts.pory"
	setvar VAR_0x8007, 3   @ shake delay
# 56 "data/maps/JaggedPass/scripts.pory"
	special ShakeCamera
# 57 "data/maps/JaggedPass/scripts.pory"
	waitstate
# 58 "data/maps/JaggedPass/scripts.pory"
	playse SE_EFFECTIVE
# 59 "data/maps/JaggedPass/scripts.pory"
	setmetatile 16, 17, METATILE_Lavaridge_CaveEntrance_Top, TRUE
# 60 "data/maps/JaggedPass/scripts.pory"
	setmetatile 16, 18, METATILE_Lavaridge_CaveEntrance_Bottom, FALSE
# 61 "data/maps/JaggedPass/scripts.pory"
	special DrawWholeMapView
# 62 "data/maps/JaggedPass/scripts.pory"
	delay 30
# 63 "data/maps/JaggedPass/scripts.pory"
	setvar VAR_JAGGED_PASS_STATE, 2
# 64 "data/maps/JaggedPass/scripts.pory"
	waitse
# 65 "data/maps/JaggedPass/scripts.pory"
	releaseall
# 66 "data/maps/JaggedPass/scripts.pory"
	end
# 67 "data/maps/JaggedPass/scripts.pory"

# 68 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_MagmaHideoutGuard::
# 69 "data/maps/JaggedPass/scripts.pory"
	lockall
# 70 "data/maps/JaggedPass/scripts.pory"
	goto_if_set FLAG_BEAT_MAGMA_GRUNT_JAGGED_PASS, JaggedPass_EventScript_GuardDefeated
# 71 "data/maps/JaggedPass/scripts.pory"
	waitse
# 72 "data/maps/JaggedPass/scripts.pory"
	playse SE_PIN
# 73 "data/maps/JaggedPass/scripts.pory"
	applymovement LOCALID_HIDEOUT_GUARD, Common_Movement_ExclamationMark
# 74 "data/maps/JaggedPass/scripts.pory"
	waitmovement 0
# 75 "data/maps/JaggedPass/scripts.pory"
	applymovement LOCALID_HIDEOUT_GUARD, Common_Movement_Delay48
# 76 "data/maps/JaggedPass/scripts.pory"
	waitmovement 0
# 77 "data/maps/JaggedPass/scripts.pory"
	applymovement LOCALID_HIDEOUT_GUARD, Common_Movement_FacePlayer
# 78 "data/maps/JaggedPass/scripts.pory"
	waitmovement 0
# 79 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_GruntIntro, MSGBOX_DEFAULT
# 80 "data/maps/JaggedPass/scripts.pory"
	closemessage
# 81 "data/maps/JaggedPass/scripts.pory"
	trainerbattle_no_intro TRAINER_GRUNT_JAGGED_PASS, JaggedPass_Text_GruntDefeat
# 82 "data/maps/JaggedPass/scripts.pory"
	setflag FLAG_BEAT_MAGMA_GRUNT_JAGGED_PASS
# 83 "data/maps/JaggedPass/scripts.pory"
	applymovement LOCALID_HIDEOUT_GUARD, Common_Movement_FaceOriginalDirection
# 84 "data/maps/JaggedPass/scripts.pory"
	waitmovement 0
# 85 "data/maps/JaggedPass/scripts.pory"
	releaseall
# 86 "data/maps/JaggedPass/scripts.pory"
	end
# 87 "data/maps/JaggedPass/scripts.pory"

# 88 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_GuardDefeated::
# 89 "data/maps/JaggedPass/scripts.pory"
	applymovement LOCALID_HIDEOUT_GUARD, Common_Movement_FacePlayer
# 90 "data/maps/JaggedPass/scripts.pory"
	waitmovement 0
# 91 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_GoWhereverYouWant, MSGBOX_DEFAULT
# 92 "data/maps/JaggedPass/scripts.pory"
	closemessage
# 93 "data/maps/JaggedPass/scripts.pory"
	applymovement LOCALID_HIDEOUT_GUARD, Common_Movement_FaceOriginalDirection
# 94 "data/maps/JaggedPass/scripts.pory"
	waitmovement 0
# 95 "data/maps/JaggedPass/scripts.pory"
	releaseall
# 96 "data/maps/JaggedPass/scripts.pory"
	end
# 97 "data/maps/JaggedPass/scripts.pory"

# 98 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_Eric::
# 99 "data/maps/JaggedPass/scripts.pory"
	trainerbattle_single TRAINER_ERIC, JaggedPass_Text_EricIntro, JaggedPass_Text_EricDefeat
# 100 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_EricPostBattle, MSGBOX_AUTOCLOSE
# 101 "data/maps/JaggedPass/scripts.pory"
	end
# 102 "data/maps/JaggedPass/scripts.pory"

# 103 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_Diana::
# 104 "data/maps/JaggedPass/scripts.pory"
	trainerbattle_single TRAINER_DIANA_1, JaggedPass_Text_DianaIntro, JaggedPass_Text_DianaDefeat, JaggedPass_EventScript_RegisterDiana
# 105 "data/maps/JaggedPass/scripts.pory"
	specialvar VAR_RESULT, ShouldTryRematchBattle
# 106 "data/maps/JaggedPass/scripts.pory"
	goto_if_eq VAR_RESULT, TRUE, JaggedPass_EventScript_DianaRematch
# 107 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_DianaPostBattle, MSGBOX_DEFAULT
# 108 "data/maps/JaggedPass/scripts.pory"
	release
# 109 "data/maps/JaggedPass/scripts.pory"
	end
# 110 "data/maps/JaggedPass/scripts.pory"

# 111 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_RegisterDiana::
# 112 "data/maps/JaggedPass/scripts.pory"
	special PlayerFaceTrainerAfterBattle
# 113 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_DianaRegister, MSGBOX_DEFAULT
# 114 "data/maps/JaggedPass/scripts.pory"
	register_matchcall TRAINER_DIANA_1
# 115 "data/maps/JaggedPass/scripts.pory"
	release
# 116 "data/maps/JaggedPass/scripts.pory"
	end
# 117 "data/maps/JaggedPass/scripts.pory"

# 118 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_DianaRematch::
# 119 "data/maps/JaggedPass/scripts.pory"
	trainerbattle_rematch TRAINER_DIANA_1, JaggedPass_Text_DianaRematchIntro, JaggedPass_Text_DianaRematchDefeat
# 120 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_DianaPostRematch, MSGBOX_AUTOCLOSE
# 121 "data/maps/JaggedPass/scripts.pory"
	end
# 122 "data/maps/JaggedPass/scripts.pory"

# 123 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_Ethan::
# 124 "data/maps/JaggedPass/scripts.pory"
	trainerbattle_single TRAINER_ETHAN_1, JaggedPass_Text_EthanIntro, JaggedPass_Text_EthanDefeat, JaggedPass_EventScript_RegisterEthan
# 125 "data/maps/JaggedPass/scripts.pory"
	specialvar VAR_RESULT, ShouldTryRematchBattle
# 126 "data/maps/JaggedPass/scripts.pory"
	goto_if_eq VAR_RESULT, TRUE, JaggedPass_EventScript_EthanRematch
# 127 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_EthanPostBattle, MSGBOX_DEFAULT
# 128 "data/maps/JaggedPass/scripts.pory"
	release
# 129 "data/maps/JaggedPass/scripts.pory"
	end
# 130 "data/maps/JaggedPass/scripts.pory"

# 131 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_RegisterEthan::
# 132 "data/maps/JaggedPass/scripts.pory"
	special PlayerFaceTrainerAfterBattle
# 133 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_EthanRegister, MSGBOX_DEFAULT
# 134 "data/maps/JaggedPass/scripts.pory"
	register_matchcall TRAINER_ETHAN_1
# 135 "data/maps/JaggedPass/scripts.pory"
	release
# 136 "data/maps/JaggedPass/scripts.pory"
	end
# 137 "data/maps/JaggedPass/scripts.pory"

# 138 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_EthanRematch::
# 139 "data/maps/JaggedPass/scripts.pory"
	trainerbattle_rematch TRAINER_ETHAN_1, JaggedPass_Text_EthanRematchIntro, JaggedPass_Text_EthanRematchDefeat
# 140 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_EthanPostRematch, MSGBOX_AUTOCLOSE
# 141 "data/maps/JaggedPass/scripts.pory"
	end
# 142 "data/maps/JaggedPass/scripts.pory"

# 143 "data/maps/JaggedPass/scripts.pory"
JaggedPass_EventScript_Autumn::
# 144 "data/maps/JaggedPass/scripts.pory"
	trainerbattle_single TRAINER_AUTUMN, JaggedPass_Text_AutumnIntro, JaggedPass_Text_AutumnDefeat
# 145 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_Text_AutumnPostBattle, MSGBOX_AUTOCLOSE
# 146 "data/maps/JaggedPass/scripts.pory"
	end
# 147 "data/maps/JaggedPass/scripts.pory"

# 148 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_EricIntro:
# 149 "data/maps/JaggedPass/scripts.pory"
	.string "MT. CHIMNEY's JAGGED PASS…\p"
# 150 "data/maps/JaggedPass/scripts.pory"
	.string "Now this is what I've always wanted\n"
# 151 "data/maps/JaggedPass/scripts.pory"
	.string "in a mountain.\p"
# 152 "data/maps/JaggedPass/scripts.pory"
	.string "This jagged bumpiness…\n"
# 153 "data/maps/JaggedPass/scripts.pory"
	.string "It rocks my soul!$"
# 154 "data/maps/JaggedPass/scripts.pory"

# 155 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_EricDefeat:
# 156 "data/maps/JaggedPass/scripts.pory"
	.string "Losing left me bitter!$"
# 157 "data/maps/JaggedPass/scripts.pory"

# 158 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_EricPostBattle:
# 159 "data/maps/JaggedPass/scripts.pory"
	.string "Yes, I did lose at Pokémon…\p"
# 160 "data/maps/JaggedPass/scripts.pory"
	.string "But, when it comes to the love of\n"
# 161 "data/maps/JaggedPass/scripts.pory"
	.string "the mountains, I have you beat!$"
# 162 "data/maps/JaggedPass/scripts.pory"

# 163 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_DianaIntro:
# 164 "data/maps/JaggedPass/scripts.pory"
	.string "This place isn't your casual hike.\n"
# 165 "data/maps/JaggedPass/scripts.pory"
	.string "It's not suited for a picnic.$"
# 166 "data/maps/JaggedPass/scripts.pory"

# 167 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_DianaDefeat:
# 168 "data/maps/JaggedPass/scripts.pory"
	.string "Ohhh, no!\n"
# 169 "data/maps/JaggedPass/scripts.pory"
	.string "The ground is too bumpy…$"
# 170 "data/maps/JaggedPass/scripts.pory"

# 171 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_DianaPostBattle:
# 172 "data/maps/JaggedPass/scripts.pory"
	.string "Did you know?\p"
# 173 "data/maps/JaggedPass/scripts.pory"
	.string "Some people cleverly ride their\n"
# 174 "data/maps/JaggedPass/scripts.pory"
	.string "bicycles up this horribly bumpy pass.$"
# 175 "data/maps/JaggedPass/scripts.pory"

# 176 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_DianaRegister:
# 177 "data/maps/JaggedPass/scripts.pory"
	.string "Will you ever be back in this area?\n"
# 178 "data/maps/JaggedPass/scripts.pory"
	.string "If you do return, I'd like a rematch.$"
# 179 "data/maps/JaggedPass/scripts.pory"

# 180 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_DianaRematchIntro:
# 181 "data/maps/JaggedPass/scripts.pory"
	.string "Picnics are fun wherever you go.\n"
# 182 "data/maps/JaggedPass/scripts.pory"
	.string "Just like Pokémon!$"
# 183 "data/maps/JaggedPass/scripts.pory"

# 184 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_DianaRematchDefeat:
# 185 "data/maps/JaggedPass/scripts.pory"
	.string "I only lost because the ground is\n"
# 186 "data/maps/JaggedPass/scripts.pory"
	.string "too bumpy!$"
# 187 "data/maps/JaggedPass/scripts.pory"

# 188 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_DianaPostRematch:
# 189 "data/maps/JaggedPass/scripts.pory"
	.string "I'll forget about losing and just\n"
# 190 "data/maps/JaggedPass/scripts.pory"
	.string "enjoy this bumpy hike.$"
# 191 "data/maps/JaggedPass/scripts.pory"

# 192 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_EthanIntro:
# 193 "data/maps/JaggedPass/scripts.pory"
	.string "JAGGED PASS is hard to walk on.\n"
# 194 "data/maps/JaggedPass/scripts.pory"
	.string "It's a good place for training.$"
# 195 "data/maps/JaggedPass/scripts.pory"

# 196 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_EthanDefeat:
# 197 "data/maps/JaggedPass/scripts.pory"
	.string "It was all over while we were still\n"
# 198 "data/maps/JaggedPass/scripts.pory"
	.string "trying to find a good footing…$"
# 199 "data/maps/JaggedPass/scripts.pory"

# 200 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_EthanPostBattle:
# 201 "data/maps/JaggedPass/scripts.pory"
	.string "If I had an ACRO BIKE, I'd be able to\n"
# 202 "data/maps/JaggedPass/scripts.pory"
	.string "jump ledges.$"
# 203 "data/maps/JaggedPass/scripts.pory"

# 204 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_EthanRegister:
# 205 "data/maps/JaggedPass/scripts.pory"
	.string "When I get more used to this bumpiness,\n"
# 206 "data/maps/JaggedPass/scripts.pory"
	.string "I'll be sure to win!\p"
# 207 "data/maps/JaggedPass/scripts.pory"
	.string "Can you register me in your PokéNav?$"
# 208 "data/maps/JaggedPass/scripts.pory"

# 209 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_EthanRematchIntro:
# 210 "data/maps/JaggedPass/scripts.pory"
	.string "I got used to this bumpiness.\n"
# 211 "data/maps/JaggedPass/scripts.pory"
	.string "I sing while I climb now.$"
# 212 "data/maps/JaggedPass/scripts.pory"

# 213 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_EthanRematchDefeat:
# 214 "data/maps/JaggedPass/scripts.pory"
	.string "It's still not easy to battle on this\n"
# 215 "data/maps/JaggedPass/scripts.pory"
	.string "bumpy ground…$"
# 216 "data/maps/JaggedPass/scripts.pory"

# 217 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_EthanPostRematch:
# 218 "data/maps/JaggedPass/scripts.pory"
	.string "I should get an ACRO BIKE from RYDEL\n"
# 219 "data/maps/JaggedPass/scripts.pory"
	.string "in MAUVILLE CITY…$"
# 220 "data/maps/JaggedPass/scripts.pory"

# 221 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_GruntIntro:
# 222 "data/maps/JaggedPass/scripts.pory"
	.string "Wah!\n"
# 223 "data/maps/JaggedPass/scripts.pory"
	.string "What are you doing here?\p"
# 224 "data/maps/JaggedPass/scripts.pory"
	.string "What am I doing in a place like this?\p"
# 225 "data/maps/JaggedPass/scripts.pory"
	.string "What business is it of yours?$"
# 226 "data/maps/JaggedPass/scripts.pory"

# 227 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_GruntDefeat:
# 228 "data/maps/JaggedPass/scripts.pory"
	.string "Urrrgh…\p"
# 229 "data/maps/JaggedPass/scripts.pory"
	.string "I should've ducked into our Hideout\n"
# 230 "data/maps/JaggedPass/scripts.pory"
	.string "right away…$"
# 231 "data/maps/JaggedPass/scripts.pory"

# 232 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_GoWhereverYouWant:
# 233 "data/maps/JaggedPass/scripts.pory"
	.string "Okay, oh-kay!\n"
# 234 "data/maps/JaggedPass/scripts.pory"
	.string "I admit it--you're strong!\p"
# 235 "data/maps/JaggedPass/scripts.pory"
	.string "Don't worry about me.\n"
# 236 "data/maps/JaggedPass/scripts.pory"
	.string "Go wherever you want!$"
# 237 "data/maps/JaggedPass/scripts.pory"

# 238 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_BoulderShakingInResponseToEmblem:
# 239 "data/maps/JaggedPass/scripts.pory"
	.string "Oh! This boulder is shaking in response\n"
# 240 "data/maps/JaggedPass/scripts.pory"
	.string "to the Magma Emblem!$"
# 241 "data/maps/JaggedPass/scripts.pory"

# 242 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_AutumnIntro:
# 243 "data/maps/JaggedPass/scripts.pory"
	.string "I climb this hill every day.\n"
# 244 "data/maps/JaggedPass/scripts.pory"
	.string "I have confidence in my strength!$"
# 245 "data/maps/JaggedPass/scripts.pory"

# 246 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_AutumnDefeat:
# 247 "data/maps/JaggedPass/scripts.pory"
	.string "Hmm…\n"
# 248 "data/maps/JaggedPass/scripts.pory"
	.string "What went wrong?$"
# 249 "data/maps/JaggedPass/scripts.pory"

# 250 "data/maps/JaggedPass/scripts.pory"
JaggedPass_Text_AutumnPostBattle:
# 251 "data/maps/JaggedPass/scripts.pory"
	.string "What is that odd rock protrusion\n"
# 252 "data/maps/JaggedPass/scripts.pory"
	.string "a little up the hill from here?$"

JaggedPass_EventScript_Maylene::
# 257 "data/maps/JaggedPass/scripts.pory"
	lockall
# 258 "data/maps/JaggedPass/scripts.pory"
	applymovement 7, Common_Movement_FacePlayer
# 259 "data/maps/JaggedPass/scripts.pory"
	goto_if_defeated TRAINER_MAYLENE, JaggedPass_EventScript_MayleneDefeated
# 260 "data/maps/JaggedPass/scripts.pory"
	goto_if_set FLAG_TEMP_1, JaggedPass_EventScript_MayleneRequestBattleAgain
# 261 "data/maps/JaggedPass/scripts.pory"
	msgbox Maylene_Greeting, MSGBOX_YESNO
# 262 "data/maps/JaggedPass/scripts.pory"
	goto JaggedPass_EventScript_BattleMaylenePrompt
	end


JaggedPass_EventScript_MayleneRequestBattleAgain::
# 267 "data/maps/JaggedPass/scripts.pory"
	msgbox Maylene_ReadyYet, MSGBOX_YESNO
# 268 "data/maps/JaggedPass/scripts.pory"
	goto JaggedPass_EventScript_BattleMaylenePrompt
	end


JaggedPass_EventScript_BattleMaylenePrompt::
# 273 "data/maps/JaggedPass/scripts.pory"
	call_if_eq VAR_RESULT, YES, JaggedPass_EventScript_BattleMaylene
# 274 "data/maps/JaggedPass/scripts.pory"
	goto_if_eq VAR_RESULT, NO, JaggedPass_EventScript_DeclineMayleneBattle
# 275 "data/maps/JaggedPass/scripts.pory"
	closemessage
	end


JaggedPass_EventScript_DeclineMayleneBattle::
# 280 "data/maps/JaggedPass/scripts.pory"
	setflag FLAG_TEMP_1
# 281 "data/maps/JaggedPass/scripts.pory"
	msgbox Maylene_ComeBackWhenReady, MSGBOX_DEFAULT
# 282 "data/maps/JaggedPass/scripts.pory"
	release
	end


JaggedPass_EventScript_BattleMaylene::
# 287 "data/maps/JaggedPass/scripts.pory"
	msgbox JaggedPass_EventScript_BattleMaylene_Text_0, MSGBOX_DEFAULT
# 288 "data/maps/JaggedPass/scripts.pory"
	trainerbattle_no_intro TRAINER_MAYLENE, Maylene_Outro
# 289 "data/maps/JaggedPass/scripts.pory"
	goto JaggedPass_EventScript_MayleneGiveItems
	return


JaggedPass_EventScript_MayleneDefeated::
# 295 "data/maps/JaggedPass/scripts.pory"
	msgbox PostBattle_Maylene, MSGBOX_DEFAULT
# 296 "data/maps/JaggedPass/scripts.pory"
	releaseall
	end


JaggedPass_EventScript_MayleneGiveItems::
@explanation Defeat Maylene
# 301 "data/maps/JaggedPass/scripts.pory"
	giveitem ITEM_TM_FOCUS_PUNCH
# 302 "data/maps/JaggedPass/scripts.pory"
	giveitem ITEM_TM_FOCUS_BLAST
# 303 "data/maps/JaggedPass/scripts.pory"
	giveitem ITEM_TM_DRAIN_PUNCH
# 304 "data/maps/JaggedPass/scripts.pory"
	giveitem ITEM_TM_BODY_PRESS
# 305 "data/maps/JaggedPass/scripts.pory"
	giveitem ITEM_TM_AURA_SPHERE
# 306 "data/maps/JaggedPass/scripts.pory"
	giveitem ITEM_LUCARIONITE
# 307 "data/maps/JaggedPass/scripts.pory"
	giveitem ITEM_MACHAMPITE
# 308 "data/maps/JaggedPass/scripts.pory"
	giveitem ITEM_EXPERT_BELT
# 309 "data/maps/JaggedPass/scripts.pory"
	msgbox Maylene_ExplainItems
# 310 "data/maps/JaggedPass/scripts.pory"
	release
	end


JaggedPass_EventScript_BattleMaylene_Text_0:
# 287 "data/maps/JaggedPass/scripts.pory"
	.string "Bring it!$"

Maylene_Greeting::
# 314 "data/maps/JaggedPass/scripts.pory"
	.string "Well, well! Is this finally a worthy\n"
	.string "opponent? I can tell that you seem\l"
	.string "pretty strong.\p"
	.string "My name is Maylene, and I came over here\n"
	.string "from the Sinnoh region because I\l"
	.string "needed to reinvigorate my training.\p"
	.string "Things had gotten boring back home, so\n"
	.string "I came out here to find tough trainers.\p"
	.string "Now, let's see if my instincts about you\n"
	.string "are correct!\p"
	.string "What do you say, will you battle\n"
	.string "with me?$"

Maylene_ReadyYet::
# 329 "data/maps/JaggedPass/scripts.pory"
	.string "Ready for some training yet?$"

Maylene_ComeBackWhenReady::
# 333 "data/maps/JaggedPass/scripts.pory"
	.string "That's fine, I'll be here training.$"

Maylene_ExplainItems::
# 337 "data/maps/JaggedPass/scripts.pory"
	.string "Those are some of the most powerful\n"
	.string "Fighting-type TMs out there, I'm sure\l"
	.string "you will be able to make use of them.\p"
	.string "I threw in some of my favorite Mega\n"
	.string "Stones as well.\p"
	.string "Finally, the Expert Belt is used for\n"
	.string "boosting moves that are super\l"
	.string "effective. Good luck, trainer!$"

Maylene_Outro::
# 348 "data/maps/JaggedPass/scripts.pory"
	.string "My instincts were right!$"

PostBattle_Maylene::
# 352 "data/maps/JaggedPass/scripts.pory"
	.string "Gotta. Get. Stronger.$"

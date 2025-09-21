# 1 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 2 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
.set LOCALID_MOVE_RELEARNER, 1
# 3 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
.set LOCALID_EGG_MAN, 2
# 4 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 5 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 6 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_MapScripts::
# 7 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.byte 0
# 8 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 9 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_EventScript_MoveRelearner::
@explanation Talk to the Move Tutor
# 10 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	lock
# 11 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	faceplayer
# 12 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_unset FLAG_BADGE04_GET, FallarborTown_MoveRelearnersHouse_EventScript_NeedLavaBadge
# 13 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_set FLAG_RECEIVED_TMS_FROM_TUTOR, FallarborTown_MoveRelearnersHouse_EventScript_ReceivedTms
# 14 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_ImTheMoveTutor, MSGBOX_DEFAULT
# 15 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_DRAGON_CLAW
# 16 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_BLIZZARD
# 17 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_THUNDER
# 18 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_TELEPORT
# 19 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_FIRE_BLAST
# 20 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_POLTERGEIST
# 21 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_THUNDER_WAVE
# 22 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_IRON_HEAD
# 23 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_LIQUIDATION
# 24 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_HYDRO_PUMP
# 25 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_DRILL_RUN
# 26 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_BLAZE_KICK
# 27 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_ZEN_HEADBUTT
# 28 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_WEATHER_BALL
# 29 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_AIR_SLASH
# 30 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_HEX
# 31 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_MYSTICAL_FIRE
# 32 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_SEED_BOMB
# 33 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_LEAF_BLADE
# 34 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_KNOCK_OFF
# 35 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_POWER_GEM
# 36 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_ROCK_BLAST
# 37 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_PIN_MISSILE
# 38 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_ICICLE_SPEAR
# 39 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_TAIL_SLAP
# 40 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_ARM_THRUST
# 41 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_FOUL_PLAY
# 42 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_IRON_DEFENSE
# 43 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_BODY_SLAM
# 44 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveitemfast ITEM_TM_PLAY_ROUGH
# 45 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	setflag FLAG_RECEIVED_TMS_FROM_TUTOR
# 46 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	playfanfare MUS_OBTAIN_ITEM
# 47 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_ReceivedSeveralTMs, MSGBOX_DEFAULT
# 48 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	waitfanfare
# 49 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_ExplainTms, MSGBOX_DEFAULT
# 50 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
# 51 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	end
# 52 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	
# 53 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 54 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_EventScript_NeedLavaBadge::
# 55 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_ImTheMoveTutorPreLava, MSGBOX_DEFAULT
# 56 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
# 57 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	end
# 58 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 59 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_EventScript_ReceivedTms::
# 60 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_NowYoureAMoveTutor, MSGBOX_DEFAULT
# 61 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
# 62 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	end
# 63 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 64 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_ExplainTms:
# 65 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "That's all the moves that I knew how to\n"
# 66 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "teach. Here, I'll even list them off, I\l"
# 67 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "just gave you the TMs for:\p"
# 68 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Dragon Claw, Thunder, Teleport, Fire\n"
# 69 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Blast, Poltergeist, Thunder Wave, Iron\l"
# 70 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Head, Liquidation, Hydro Pump, Drill Run,\l"
# 71 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Blaze Kick, Zen Headbutt, Weather Ball,\l"
# 72 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Air Slash, Hex, Mystical Fire, Seed Bomb,\l"
# 73 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Leaf Blade, Knock Off, Power Gem, Rock\l"
# 74 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Blast, Pin Missile, Icicle Spear, Tail\l"
# 75 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Slap, Arm Thrust, Foul Play, Iron\l"
# 76 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Defense, Body Slam, Play Rough,\l"
# 77 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "and Blizzard.\p"
# 78 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Now you can take those moves with you\n"
# 79 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "and teach them to your Pokémon\l"
# 80 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "wherever you are!$"
# 81 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 82 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_NowYoureAMoveTutor:
# 83 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Now YOU'RE a Move Tutor! Hah!$"
# 84 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 85 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_ReceivedSeveralTMs::
# 86 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "{PLAYER} received several TMs!$"
# 87 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 88 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 89 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_EventScript_MoveRelearnerOriginal::
# 90 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	lockall
# 91 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	applymovement LOCALID_MOVE_RELEARNER, Common_Movement_FacePlayer
# 92 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	waitmovement 0
# 93 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_ImTheMoveTutor, MSGBOX_DEFAULT
# 94 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto FallarborTown_MoveRelearnersHouse_EventScript_AskTeachMove
# 95 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	end
# 96 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 97 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_EventScript_AskTeachMove::
# 98 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_ThatsAHeartScaleWantMeToTeachMove, MSGBOX_YESNO
# 99 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	switch VAR_RESULT
# 100 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	case NO, FallarborTown_MoveRelearnersHouse_EventScript_ComeBackWithHeartScale
# 101 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto FallarborTown_MoveRelearnersHouse_EventScript_ChooseMon
# 102 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	end
# 103 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 104 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_EventScript_ChooseMon::
# 105 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_TutorWhichMon, MSGBOX_DEFAULT
# 106 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	special ChooseMonForMoveRelearner
# 107 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	waitstate
# 108 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_eq VAR_0x8004, PARTY_NOTHING_CHOSEN, FallarborTown_MoveRelearnersHouse_EventScript_ComeBackWithHeartScale
# 109 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	special IsSelectedMonEgg
# 110 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_eq VAR_RESULT, TRUE, FallarborTown_MoveRelearnersHouse_EventScript_CantTeachEgg
# 111 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_eq VAR_0x8005, 0, FallarborTown_MoveRelearnersHouse_EventScript_NoMoveToTeachMon
# 112 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto FallarborTown_MoveRelearnersHouse_EventScript_ChooseMove
# 113 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	end
# 114 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 115 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_EventScript_ChooseMove::
# 116 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_TeachWhichMove, MSGBOX_DEFAULT
# 117 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	special TeachMoveRelearnerMove
# 118 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	waitstate
# 119 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_eq VAR_0x8004, 0, FallarborTown_MoveRelearnersHouse_EventScript_ChooseMon
# 120 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_HandedOverHeartScale, MSGBOX_DEFAULT
# 121 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto FallarborTown_MoveRelearnersHouse_EventScript_ComeBackWithHeartScale
# 122 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	end
# 123 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 124 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_EventScript_NoMoveToTeachMon::
# 125 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_DontHaveMoveToTeachPokemon, MSGBOX_DEFAULT
# 126 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto FallarborTown_MoveRelearnersHouse_EventScript_ChooseMon
# 127 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	end
# 128 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 129 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_EventScript_CantTeachEgg::
# 130 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_CantTeachEgg, MSGBOX_DEFAULT
# 131 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto FallarborTown_MoveRelearnersHouse_EventScript_ChooseMon
# 132 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	end
# 133 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 134 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_EventScript_ComeBackWithHeartScale::
# 135 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_ComeBackWithHeartScale, MSGBOX_DEFAULT
# 136 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	releaseall
# 137 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	end
# 138 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 139 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_ImTheMoveTutorPreLava:
# 140 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "I'm the Move Tutor.\n"
# 141 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Or at least I used to be. I got tired of\l"
# 142 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "collecting Heart Scales and teaching\l"
# 143 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Pokémon the same moves over and over\l"
# 144 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "again, and trainers got tired of coming\l"
# 145 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "all the way out here just to have me\l"
# 146 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "teach them moves. So, I solved both\l"
# 147 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "problems by making these!\p"
# 148 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Hmm, on second thought, you don't even\n"
# 149 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "4 Badges yet.\p"
# 150 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "I'm not sure you're ready for all of\n"
# 151 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "these TMs I've made.\p"
# 152 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Come back once you've got 4 Badges\n"
# 153 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "and we'll talk.$"
# 154 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 155 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_ImTheMoveTutor:
# 156 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Well, well, look at you!\n"
# 157 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "I see you've got 4 Badges now, I think\l"
# 158 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "that means you're ready for these.$"
# 159 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 160 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_ThatsAHeartScaleWantMeToTeachMove:
# 161 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Oh! That's it! That's an honest to\n"
# 162 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "goodness Heart Scale!\p"
# 163 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Let me guess, you want me to teach\n"
# 164 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "a move?$"
# 165 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 166 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_TutorWhichMon:
# 167 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Which Pokémon needs tutoring?$"
# 168 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 169 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_TeachWhichMove:
# 170 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Which move should I teach?$"
# 171 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 172 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_DontHaveMoveToTeachPokemon:
# 173 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Sorry…\p"
# 174 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "It doesn't appear as if I have any move\n"
# 175 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "I can teach that Pokémon.$"
# 176 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 177 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_HandedOverHeartScale:
# 178 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "{PLAYER} handed over one Heart Scale\n"
# 179 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "in exchange.$"
# 180 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 181 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_ComeBackWithHeartScale:
# 182 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "If your Pokémon need to learn a move,\n"
# 183 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "come back with a Heart Scale.$"
# 184 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"

# 185 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
FallarborTown_MoveRelearnersHouse_Text_CantTeachEgg:
# 186 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Hunh? There isn't a single move that\n"
# 187 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "I can teach an Egg.$"

FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive::
@explanation Trade shards for starter eggs
# 192 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	lock
# 193 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	faceplayer
# 194 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox EggManIntro
# 196 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	dynmultipush FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_0, ITEM_RED_SHARD
# 197 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	dynmultipush FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_1, ITEM_BLUE_SHARD
# 198 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	dynmultipush FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_2, ITEM_GREEN_SHARD
# 199 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	dynmultipush FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_3, MULTI_B_PRESSED
# 202 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	dynmultistack 0, 0, FALSE, 6, FALSE, 3, DYN_MULTICHOICE_CB_NONE
# 204 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	compare VAR_RESULT, MULTI_B_PRESSED
	goto_if_eq FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_2
FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_1:
# 209 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	compare VAR_RESULT, ITEM_RED_SHARD
	goto_if_eq FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_5
FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_4:
# 213 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	compare VAR_RESULT, ITEM_BLUE_SHARD
	goto_if_eq FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_8
FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_7:
# 218 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	compare VAR_RESULT, ITEM_GREEN_SHARD
	goto_if_eq FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_11
FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_10:
# 223 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
	end

FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_2:
# 206 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto FallarborTown_MoveRelearnersHouse_EventScript_EggManNo
	goto FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_1

FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_5:
# 211 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto FallarborTown_MoveRelearnersHouse_EventScript_GiveFireEgg
	goto FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_4

FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_8:
# 215 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto FallarborTown_MoveRelearnersHouse_EventScript_GiveWaterEgg
# 216 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_4
	goto FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_7

FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_11:
# 220 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto FallarborTown_MoveRelearnersHouse_EventScript_GiveGrassEgg
# 221 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_4
	goto FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_10


FallarborTown_MoveRelearnersHouse_EventScript_GiveFireEgg::
@explanation Trade for Red Shard (random species)
# 229 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	checkitem ITEM_RED_SHARD
# 230 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_eq VAR_RESULT, FALSE, FallarborTown_MoveRelearnersHouse_EventScript_ComeBackWithRedShard
# 231 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	getpartysize
# 232 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_eq VAR_RESULT, PARTY_SIZE, FallarborTown_MoveRelearnersHouse_EventScript_NoRoomForEgg
# 233 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_EventScript_GiveFireEgg_Text_0
# 234 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	playfanfare MUS_OBTAIN_ITEM
# 235 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	message FallarborTown_MoveRelearnersHouse_Text_ReceivedTheEgg
# 236 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	waitfanfare
# 237 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveegg SPECIES_CHARMANDER
# 238 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	removeitem ITEM_RED_SHARD
# 239 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_4
# 240 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
	end


FallarborTown_MoveRelearnersHouse_EventScript_GiveWaterEgg::
@explanation Trade for Blue Shard (random species)
# 245 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	checkitem ITEM_BLUE_SHARD
# 246 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_eq VAR_RESULT, FALSE, FallarborTown_MoveRelearnersHouse_EventScript_ComeBackWithBlueShard
# 247 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	getpartysize
# 248 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_eq VAR_RESULT, PARTY_SIZE, FallarborTown_MoveRelearnersHouse_EventScript_NoRoomForEgg
# 249 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_EventScript_GiveFireEgg_Text_0
# 250 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	playfanfare MUS_OBTAIN_ITEM
# 251 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	message FallarborTown_MoveRelearnersHouse_Text_ReceivedTheEgg
# 252 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	waitfanfare
# 253 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveegg SPECIES_SQUIRTLE
# 254 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	removeitem ITEM_BLUE_SHARD
# 255 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_4
# 256 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
	end


FallarborTown_MoveRelearnersHouse_EventScript_GiveGrassEgg::
@explanation Trade for Green Shard (random egg)
# 261 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	checkitem ITEM_GREEN_SHARD
# 262 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_eq VAR_RESULT, FALSE, FallarborTown_MoveRelearnersHouse_EventScript_ComeBackWithGreenShard
# 263 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	getpartysize
# 264 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	goto_if_eq VAR_RESULT, PARTY_SIZE, FallarborTown_MoveRelearnersHouse_EventScript_NoRoomForEgg
# 265 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_EventScript_GiveFireEgg_Text_0
# 266 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	playfanfare MUS_OBTAIN_ITEM
# 267 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	message FallarborTown_MoveRelearnersHouse_Text_ReceivedTheEgg
# 268 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	waitfanfare
# 269 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	giveegg SPECIES_BULBASAUR
# 270 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	removeitem ITEM_GREEN_SHARD
# 271 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_4
# 272 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
	end


FallarborTown_MoveRelearnersHouse_EventScript_EggManNo::
# 277 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_EventScript_EggManNo_Text_0
# 278 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
	end


FallarborTown_MoveRelearnersHouse_EventScript_ComeBackWithRedShard::
# 283 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_ComeBackWithRedShard, MSGBOX_DEFAULT
# 284 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
	end


FallarborTown_MoveRelearnersHouse_EventScript_ComeBackWithBlueShard::
# 289 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_ComeBackWithBlueShard, MSGBOX_DEFAULT
# 290 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
	end


FallarborTown_MoveRelearnersHouse_EventScript_ComeBackWithGreenShard::
# 295 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_ComeBackWithGreenShard, MSGBOX_DEFAULT
# 296 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
	end


FallarborTown_MoveRelearnersHouse_EventScript_NoRoomForEgg::
# 301 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	msgbox FallarborTown_MoveRelearnersHouse_Text_NoRoomForThisEgg, MSGBOX_DEFAULT
# 302 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	release
	end


FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_0:
# 196 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "{COLOR RED}{SHADOW LIGHT_RED}Fire$"

FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_1:
# 197 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "{COLOR BLUE}{SHADOW LIGHT_BLUE}Water$"

FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_2:
# 198 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "{COLOR GREEN}{SHADOW LIGHT_GREEN}Grass$"

FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_3:
# 199 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Cancel$"

FallarborTown_MoveRelearnersHouse_EventScript_StarterEggGive_Text_4:
# 216 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Come back if you have more shards!$"

FallarborTown_MoveRelearnersHouse_EventScript_GiveFireEgg_Text_0:
# 233 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "A wise choice. Here you go.$"

FallarborTown_MoveRelearnersHouse_EventScript_EggManNo_Text_0:
# 277 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "I see. Come back when you\nwant a starter egg.$"

EggManIntro::
# 309 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Hello, I am a shard collector. If you\n"
	.string "give me a Red Shard, I can give you an\l"
	.string "Egg for a Fire-type starter Pokémon.\p"
	.string "I can do the same with Blue Shards and\n"
	.string "Green Shards for the other types of\l"
	.string "starters.\p"
	.string "Which type of Egg do you want?$"

FallarborTown_MoveRelearnersHouse_Text_ComeBackWithRedShard::
# 320 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "It doesn't look like you have a Red\n"
	.string "Shard. Come back when you do.$"

FallarborTown_MoveRelearnersHouse_Text_ComeBackWithBlueShard::
# 325 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "It doesn't look like you have a Blue\n"
	.string "Shard. Come back when you do.$"

FallarborTown_MoveRelearnersHouse_Text_ComeBackWithGreenShard::
# 330 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "It doesn't look like you have a Green\n"
	.string "Shard. Come back when you do.$"

FallarborTown_MoveRelearnersHouse_Text_NoRoomForThisEgg::
# 335 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "Oh? You've too many Pokémon.\n"
	.string "There's no room for this Egg.$"

FallarborTown_MoveRelearnersHouse_Text_ReceivedTheEgg::
# 340 "data/maps/FallarborTown_MoveRelearnersHouse/scripts.pory"
	.string "{PLAYER} received the Egg.$"

execute as @e[tag=silence] run particle cz:silence ~~0.5~
execute as @a[tag=ultimate] anchored eyes at @s run camera @s set minecraft:free ease 0.1 in_out_quad pos ^-1.3^1.6^1.7 facing @s
execute as @a[tag=!ultimate,tag=!preview] run camera @s clear

execute as @e at @s if block ~~~ water run scriptevent cz:status wet 8 1 wet false time

scoreboard objectives add silent dummy silent

scoreboard players add @a silent 0

tag @a[tag=liberator_target] remove liberator_target
tag @a[tag=silence] remove silence
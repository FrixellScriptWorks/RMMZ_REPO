//============================================================================
// Frixell SW - Customized Gold Rate (v. 1.00)
// FrixellSW_2_GoldRate.js
//============================================================================

var Imported = Imported || {};
Imported.FrixellSW_2_GoldRate = true;

var FrixellSW = FrixellSW || {};
FrixellSW.ExtraEngine = FrixellSW.ExtraEngine || {};
FrixellSW.ExtraEngine.version = 1.0;

//============================================================================
/*:
* @target MZ
* @plugindesc [RPG Maker MZ] [Tier 2] [Customized Gold Rate]
* @author Frixell Script Works
* @url https://github.com/FrixellScriptWorks
*
* @help
* ============================================================================
* Introduction
* ============================================================================
* Customized Gold Rate can shift the binary gold rate model provided by RMMZ.
* 
* Features:
* 
* * Change gold rate gained from battle with equipment notetags.
* * Give bonus gold with changeable amount gained from battle with equipment 
*   notetags.
*
* ============================================================================
* Requirements
* ============================================================================
* 
* * This script is for RPG Maker MZ. I never touch MV, sorry.
* * This is Tier 2 plugin. Make sure you put this plugin under all VisuStella 
* * Core Engines if you use them.
* 
* ============================================================================
* Compatibility
* ============================================================================
* 
* This plugin basically independent, so the compatibility is high.
*
* ============================================================================
* Notetags
* ============================================================================
* The following are notetags that have been added through this plugin. These
* notetags will not work with your game if this plugin is OFF or not present.
* 
* ---
*
* <GOLD_MULT: x%>
* 
* - Place it in: Weapon and Armor Notetags.
* - Adjust the rate of gained gold from battle by x%. However, if PARTY ABILITY:
*   GOLD DOUBLE trait is active, then gold rate is back to double.
* - replace x with percentage value of gold rate. If you want a gold rate for
*   150%, then replace x with 150.
* - If equipments with same notetags equipped, then the percentage will multiply.
*   (150% * 150% = 225% total)
* 
* ---
* 
* <GOLD_BONUS: x>
* - Place it in: Weapon and Armor Notetags.
* - Add constant gold bonus to your party after winning a battle. This not
*   change any gold rates gained.
* - replace x with a number value you desired. Negative values will converted
*   to positive one.
* 
* ============================================================================
* Terms of Use
* ============================================================================
* 
* 1. This plugin is free to use whether in free or commercial projects. You 
*    can copy, edit, and distribute this plugin as long as you credit me and/or
*    people involved (because they may have different terms of use).
*
* 2. This plugin is provided "as is", you may ask for any problems but I have
*    no responsibility to answer ALL problems. But I will try to solve it.
*
* ============================================================================
* Credits
* ============================================================================
* 
* - Frixell Script Works @2021 -
*
* Special Thanks to:
* 
* - Alistair (for syntax access and referencing).
* - Team VisuStella [Yanfly, Arisu, Olivia, Irina] (for all learning 
*   documentations and their core plugins).
* 
* ============================================================================
* Changelogs
* ============================================================================
* 
* Version 1.00 (27 June 2021)
* - Script Finished.
* 
* ============================================================================
* Known Bugs
* ============================================================================
*
* None (Added soon, lol)
*
* 
* ============================================================================
 */
(function() {
//============================================================================
//				REGEXP HANDLING          
//============================================================================
FSW_GoldMultiplier_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
   if (!FSW_GoldMultiplier_DataManager_isDatabaseLoaded.call(this)) return false;
   this.processFSWGM1($dataWeapons);
   this.processFSWGM1($dataArmors);
   return true;
};

DataManager.processFSWGM1 = function(dataGroup) {
    const FSWGM1_1 = /<(?:GOLD_MULT):[ ](\d+)%>/i;
    const FSWGM1_2 = /<(?:GOLD_BONUS):[ ]([+-]\d+)%>/i;
   for (let i = 1; i < dataGroup.length; i++) {
       let object = dataGroup[i];
       let noteData = object.note.split(/[\r\n]+/);
   	
       object.fswGoldMultiplier = 1;
       object.fswGoldBonus = 0;

       for (let n = 0; n < noteData.length; n++) {
           let line = noteData[n];
           if (line.match(FSWGM1_1)) {
               object.fswGoldMultiplier *= parseFloat(RegExp.$1 * 0.01);
           } else if (line.match(FSWGM1_2)) {
               object.fswGoldBonus = parseFloat(RegExp.$1 * 0.01);
           };
       };
   };
};

//============================================================================
//				END OF REGEXP HANDLING      
//============================================================================

//New function Game_Party.prototype.goldMulti(arg)
//arg determines which value will returned.
Game_Party.prototype.goldMulti = function (a) {
    /*
    let arg = arg;
    */
    let fswGoldMultiplier = 1;
    let fswGoldBonus = 0;

    const nomer = this.size()
    for (let i = 0; i < nomer; i++) {
        const actor = this.members()[i];
        for (let j = 0; j < actor.equips().length; j++) {
            let item = actor.equips()[j]
            if (item) {
                fswGoldMultiplier *= eval(item.fswGoldMultiplier);
                fswGoldBonus += eval(item.fswGoldBonus);
            };
        };
    };

    switch (a) {
        //Separating Multiplier and Bonus
        case "multi": return fswGoldMultiplier;
        case "bonus": return fswGoldBonus;
        //Default
        default: return 0;
    };
};
    //Overwriting Gold Multiplier with New Multiplier
Game_Troop.prototype.goldRate = function () {
    if ($gameParty.hasGoldDouble() == true) {
        return 2;
    } else if ($gameParty.goldMulti("multi") > 0) {
        let rateGold = Math.ceil((1 * $gameParty.goldMulti("multi")) + Math.abs($gameParty.goldMulti("bonus")));
        return rateGold;
    } else {
        return 1;
    };
};
}) ();
//=============================================================================
// End of Plugin
//=============================================================================
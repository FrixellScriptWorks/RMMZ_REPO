//============================================================================
// Frixell SW - Extra Drops (v. 1.00)
// FrixellSW_2_ExtraDrops.js
//============================================================================

var Imported = Imported || {};
Imported.FrixellSW_2_ExtraDrops = true;

var FrixellSW = FrixellSW || {};
FrixellSW.ExtraDrops = FrixellSW.ExtraDrops || {};
FrixellSW.ExtraDrops.version = 1.00;

//============================================================================
/*:
* @target MZ
* @plugindesc [RPG Maker MZ] [Tier 2] [Extra Drops]
* @author Frixell Script Works
* @url https://github.com/FrixellScriptWorks
*
* @help
* ============================================================================
* Introduction
* ============================================================================
* Extra Drops can give you additional items after battle.
* 
* Features:
* 
* * Adds more item drop from winning a battle exceeds the editor limits.
*
* ============================================================================
* Requirements
* ============================================================================
* 
* * This script is for RPG Maker MZ.
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
* <param Drop x: y%>
* - Place it in: Enemy Notetags.
* - Added new drop parameter for use above the editor limits of tree.
* - replace x with Item, Weapon, or Armor ID will be dropped.
* - replace y with percentage value of item drop rate. If set to 100%, it will
*   certainly drop.
* - Example: <Armor Drop 17: 50%> 
*           This will drop Armor ID 17 with 50% success chance.
* 
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
* - Yanfly Engine Ace (from YEA_ExtraDrop.rb reference)
* 
* ============================================================================
* Changelogs
* ============================================================================
* 
* Version 1.00 (30 June 2021)
* - Plugin finished.
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
(function () {
    //============================================================================
    //				REGEXP HANDLING          
    //============================================================================
    FSW_ExtraDrops_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!FSW_ExtraDrops_DataManager_isDatabaseLoaded.call(this)) return false;
        this.processFSWED1($dataEnemies);
        return true;
    };

    DataManager.processFSWED1 = function (dataGroup) {
        const FSWED1_1 = /<(?:item|Item|ITEM)[ ](?:DROP|drop|Drop)[ ](\d+):[ ](\d+)%>/i;
        const FSWED1_2 = /<(?:weapon|Weapon|WEAPON)[ ](?:DROP|drop|Drop)[ ](\d+):[ ](\d+)%>/i;
        const FSWED1_3 = /<(?:armor|Armor|ARMOR)[ ](?:DROP|drop|Drop)[ ](\d+):[ ](\d+)%>/i;
        for (let i = 1; i < dataGroup.length; i++) {
            let object = dataGroup[i];
            let noteData = object.note.split(/[\r\n]+/);

            object.fswExtraDrops = [];
            object.fswKind = 0;
            object.fswDataID = 0;
            object.fswDropRate = 0;

            for (let n = 0; n < noteData.length; n++) {
                let line = noteData[n];
                if (line.match(FSWED1_1)) {
                    object.fswKind = 1;
                    object.fswDataID = parseInt(RegExp.$1);
                    object.fswDropRate = parseFloat(RegExp.$2 * 0.01);
                    let item = {
                        kind: object.fswKind,
                        dataId: object.fswDataID,
                        rates: object.fswDropRate
                    };
                    object.fswExtraDrops = object.fswExtraDrops.concat(item);
                } else if (line.match(FSWED1_2)) {
                    object.fswKind = 2;
                    object.fswDataID = parseInt(RegExp.$1);
                    object.fswDropRate = parseFloat(RegExp.$2 * 0.01);
                    let item = {
                        kind: object.fswKind,
                        dataId: object.fswDataID,
                        rates: object.fswDropRate
                    };
                    object.fswExtraDrops = object.fswExtraDrops.concat(item);
                } else if (line.match(FSWED1_3)) {
                    object.fswKind = 3;
                    object.fswDataID = parseInt(RegExp.$1);
                    object.fswDropRate = parseFloat(RegExp.$2 * 0.01);
                    let item = {
                        kind: object.fswKind,
                        dataId: object.fswDataID,
                        rates: object.fswDropRate
                    };
                    object.fswExtraDrops = object.fswExtraDrops.concat(item);
                };
            };
        };
    };

    //============================================================================
    //				END OF REGEXP HANDLING      
    //============================================================================

    //New Function
    Game_Enemy.prototype.makeExtraDrops = function () {
        const extraDrops = this.enemy().fswExtraDrops;
	    console.log(extraDrops);
        return extraDrops.reduce(function (r, di) {
            if (di.kind != 0 && Math.random() < di.rates) {
                return r.concat(this.itemObject(di.kind, di.dataId));
            } else {
                return r;
            };
        }.bind(this), []);
    };

    //Alias makeDropItems
    FSW_Enemy_Make_Drop_Items = Game_Enemy.prototype.makeDropItems;
    Game_Enemy.prototype.makeDropItems = function () {
	console.log(this.makeExtraDrops());
        let r = FSW_Enemy_Make_Drop_Items.call(this);
	return r.concat(this.makeExtraDrops());
    };
})();

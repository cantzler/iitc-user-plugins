// ==UserScript==
// @id             iitc-plugin-highlight-portals-supply-base@fl0o0l
// @name           IITC plugin: highlight portals supply base
// @category       Highlighter
// @version        0.0.1.20160106.000001
// @namespace      https://github.com/cantzler
// @updateURL      https://github.com/cantzler/iitc-user-plugins/raw/master/portal-highlighter-supply-base.user.js
// @downloadURL    https://github.com/cantzler/iitc-user-plugins/raw/master/portal-highlighter-supply-base.user.js
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'local';
plugin_info.dateTimeVersion = '20160106.000001';
plugin_info.pluginId = 'portal-highlighter-supply-base';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.portalHighlighterPortalsSupplyBase = function() {};

window.plugin.portalHighlighterPortalsSupplyBase.colorLevel = function(data) {

    var portal_guid = data.portal.options.guid;
    var resoColor = '#ffffff';
    var resoOpacity = .0;
    var portal_level = data.portal.options.level;

    if (portal_guid) {
        var data2 = portalDetail.get(portal_guid);
        
        if(data2 && data2.mods) {

            //Verifying installation
            var installedAXA = false;
            var installedVRPS = false;
            var installedRPS = false;
            var installedVRHS = false;
            var installedRHS = false;
            var installedVRMH = false;
            var installedRMH = false;
            var farmScore = 0.01;

            //MOD Confirmation
            $.each(data2.mods, function(ind, mod) {
                if(mod && mod.name !== undefined && mod.name == 'AXA Shield') {
                    installedAXA = true;
                    farmScore += 0.09;
                }
                if(mod && mod.name !== undefined && mod.name == 'Portal Shield' && mod.rarity == 'VERY_RARE') {
                    installedVRPS = true;
                    farmScore += 0.05;
                }
                if(mod && mod.name !== undefined && mod.name == 'Portal Shield' && mod.rarity == 'RARE') {
                    installedRPS = true;
                    farmScore += 0.05;
                }
                if(mod && mod.name !== undefined && mod.name == 'Heat Sink' && mod.rarity == 'VERY_RARE') {
                    installedVRHS = true;
                    farmScore += 0.4;
                }
                if(mod && mod.name !== undefined && mod.name == 'Heat Sink' && mod.rarity == 'RARE') {
                    installedRHS = true;
                    farmScore += 0.25;
                }
                if(mod && mod.name !== undefined && mod.name == 'Multi-hack' && mod.rarity == 'VERY_RARE') {
                    installedVRMH = true;
                    farmScore += 0.4;
                }
                if(mod && mod.name !== undefined && mod.name == 'Multi-hack' && mod.rarity == 'RARE') {
                    installedRMH = true;
                    farmScore += 0.25;
                }
            }); 

            if (portal_level <= 6) {
                // P6 and below no score
                farmScore *= 0;
            }
            
            if (farmScore > 0.5) {
                resoColor = '#ff0000';
                resoOpacity = 1.0;
                console.log('WARNING "' + data.portal.options.data.title + '"');
            } else if (farmScore >= 0.4) {
                resoColor = '#ff8c00';
                resoOpacity = 1.0;
                console.log('NOTE "' + data.portal.options.data.title + '"');
            } else if (farmScore >= 0.01) {
                resoColor = '#ffff00';
                resoOpacity = 0.25 * (portal_level-6);
                //console.log('NOTE "' + data.portal.options.data.title + '"');
            } else {
                var resoColor = '#ffffff';
                var resoOpacity = .2;
            }
        
        } else {
            portalDetail.request(portal_guid);
        }
        data.portal.setStyle({fillColor: resoColor, fillOpacity: resoOpacity, color: resoColor, opacity: resoOpacity});
    }
}

var setup =  function() {
  window.addPortalHighlighter('supply base', window.plugin.portalHighlighterPortalsSupplyBase.colorLevel);
}

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

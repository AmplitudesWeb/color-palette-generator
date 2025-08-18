/*
 * Color Palette Generator
 * Created by Amplitudes Web
 * 
 * This script is open source and free to use for personal projects.
 * Please credit Amplitudes Web if you use this script.
 * 
 * For commercial use, licensing, or custom development:
 * Contact: Amplitudes Web
 * 
 * © Amplitudes Web - All rights reserved
 */

(function() {
    'use strict';
    
    
    let APP_CONTAINER;
                const SHARE_BASE_URL = (() => {
    				const url = new URL(window.location.href);
    				url.hash = ''; // Remove any existing hash
    				url.search = ''; // Remove any query parameters
    				return url.toString();
    			})();
    			function compressState(state) {
    				const mini = {
    					h: state.selectedHue,
    					s: state.baseSaturation,
    					b: state.baseBrightness,
    					f: state.displayFormat === 'HEX' ? 0 : state.displayFormat === 'RGB' ? 1 : state.displayFormat === 'HSL' ? 2 : state.displayFormat === 'CSS_RGB' ? 3 : 4,
    					a: state.advancedControlsActive ? 1 : 0
    				};
    				if (state.accentHueShift !== 0) mini.ah = state.accentHueShift;
    				if (state.invertDirection) mini.id = 1;
    				if (state.dominantRelationship !== '30°') mini.dr = state.dominantRelationship === '120°' ? 1 : state.dominantRelationship === '180°' ? 2 : 3;
    				if (state.accentIntensity !== 70) mini.ai = state.accentIntensity;
    				if (state.dominantDistribution !== 60) mini.dd = state.dominantDistribution;
    				if (state.splitAngle !== 30) mini.sa = state.splitAngle;
    				if (state.triadicVibrance !== 'equal') mini.tv = state.triadicVibrance === 'full' ? 1 : state.triadicVibrance === 'cascade' ? 2 : state.triadicVibrance === 'primary-muted' ? 3 : 4;
    				if (state.neutralStrategy !== 'tinted') mini.ns = state.neutralStrategy === 'true' ? 1 : state.neutralStrategy === 'complement' ? 2 : 3;
    				if (state.neutralDepth !== 8) mini.nd = state.neutralDepth;
    				if (state.neutralSpread !== 25) mini.nsp = state.neutralSpread;
    				if (state.monochromaticSpread !== 35) mini.ms = state.monochromaticSpread;
    				if (state.accentBrightnessShift !== 0) mini.ab = state.accentBrightnessShift;
    				if (state.accentSaturationShift !== 0) mini.as = state.accentSaturationShift;
    				if (state.complementaryBalance !== 70) mini.cb = state.complementaryBalance;
    				if (state.complementaryTension !== 0) mini.ct = state.complementaryTension;
    				if (state.complementaryBrightnessMode !== 'light') mini.cm = 1;
    				if (state.analogousRange !== 60) mini.ar = state.analogousRange;
    				if (state.analogousColorCount !== 3) mini.ac = state.analogousColorCount;
    				if (state.analogousDistribution !== 'even') mini.ad = state.analogousDistribution === 'gradual' ? 1 : 2;
    				if (state.warmCoolMode !== '1:3') mini.wm = 1;
    				if (state.warmCoolContrast !== 'moderate') mini.wc = state.warmCoolContrast === 'subtle' ? 1 : 2;
    				if (state.temperatureShift !== 0) mini.ts = state.temperatureShift;
    				if (state.tetradicPairingMode !== 'rectangle') mini.tp = state.tetradicPairingMode === 'square' ? 1 : 2;
    				if (state.tetradicDominance !== 50) mini.td = state.tetradicDominance;
    				if (state.tetradicSaturationStrategy !== 'all-equal') mini.tss = state.tetradicSaturationStrategy === 'alternating' ? 1 : state.tetradicSaturationStrategy === 'gradual' ? 2 : 3;
    				if (state.splitEmphasis !== 'balanced') mini.se = state.splitEmphasis === 'primary-focused' ? 1 : 2;
    				if (state.splitSatDistribution !== 'equal') mini.ssd = state.splitSatDistribution === 'cascade' ? 1 : state.splitSatDistribution === 'diverge' ? 2 : 3;
    				if (state.triadicBalanceMode !== 'equal') mini.tbm = state.triadicBalanceMode === 'major' ? 1 : state.triadicBalanceMode === 'minor' ? 2 : 3;
    				if (state.neutralPopIntensity !== 100) mini.npi = state.neutralPopIntensity;
    				if (state.neutralBrightnessShift !== 0) mini.nbs = state.neutralBrightnessShift;
    				const dlp = {};
    				Object.keys(state.darkLightPreferences).forEach(key => {
    					const pref = state.darkLightPreferences[key];
    					if (pref.dark !== 'recommended' || pref.light !== 'recommended') {
    						const paletteIndex = ['monochromatic', 'dominant', 'neutralpop', 'analogous', 'complementary', 'warmcool', 'split', 'triadic', 'tetradic'].indexOf(key);
    						if (paletteIndex !== -1) {
    							dlp[paletteIndex] = {
    								d: pref.dark === 'recommended' ? 'r' : pref.dark,
    								l: pref.light === 'recommended' ? 'r' : pref.light
    							};
    						}
    					}
    				});
    				if (Object.keys(dlp).length > 0) mini.dlp = dlp;
    				const dlc = {};
    				Object.keys(state.darkLightAdvancedControls || {}).forEach(key => {
    					const controls = state.darkLightAdvancedControls[key];
    					const defaults = getPaletteDefaults(key)?.darkLightControls;
    					if (defaults && (
    						controls.darkSat !== defaults.darkSat ||
    						controls.lightSat !== defaults.lightSat ||
    						controls.darkBright !== defaults.darkBright ||
    						controls.lightBright !== defaults.lightBright
    					)) {
    						const paletteIndex = ['monochromatic', 'dominant', 'neutralpop', 'analogous', 'complementary', 'warmcool', 'split', 'triadic', 'tetradic'].indexOf(key);
    						if (paletteIndex !== -1) {
    							dlc[paletteIndex] = [controls.darkSat, controls.lightSat, controls.darkBright, controls.lightBright];
    						}
    					}
    				});
    				if (Object.keys(dlc).length > 0) mini.dlc = dlc;
    				if (Object.keys(state.lockedPalettes).length > 0) {
    					mini.lp = {};
    					Object.keys(state.lockedPalettes).forEach(key => {
    						const shortKey = key.substring(0, 3);
    						mini.lp[shortKey] = [
    							state.lockedPalettes[key].hue,
    							state.lockedPalettes[key].saturation,
    							state.lockedPalettes[key].brightness
    						];
    					});
    				}
    				if (state.pinnedPaletteIds && state.pinnedPaletteIds.length > 0) {
    					mini.pp = state.pinnedPaletteIds.map(id => id.substring(0, 3));
    				}
    				if (Object.keys(state.paletteBackgrounds).length > 0) {
    					mini.pb = {};
    					Object.keys(state.paletteBackgrounds).forEach(key => {
    						mini.pb[key.substring(0, 3)] = state.paletteBackgrounds[key].substring(1);
    					});
    				}
    				const jsonString = JSON.stringify(mini);
    				return btoa(jsonString)
    					.replace(/\+/g, '-')
    					.replace(/\//g, '_')
    					.replace(/=/g, '');
    			}
    			function decompressState(compressed) {
    				try {
    					let base64 = compressed.replace(/-/g, '+').replace(/_/g, '/');
    					while (base64.length % 4) base64 += '=';
    					const jsonString = atob(base64);
    					const mini = JSON.parse(jsonString);
    					const state = {
    						selectedHue: mini.h,
    						baseSaturation: mini.s,
    						baseBrightness: mini.b,
    						displayFormat: ['HEX', 'RGB', 'HSL', 'CSS_RGB', 'CSS_HSL'][mini.f] || 'HEX',
    						advancedControlsActive: mini.a === 1,
    						accentHueShift: mini.ah || 0,
    						invertDirection: mini.id === 1,
    						dominantRelationship: mini.dr ? ['', '120°', '180°', '15°'][mini.dr] : '30°',
    						accentIntensity: mini.ai || 70,
    						dominantDistribution: mini.dd || 60,
    						splitAngle: mini.sa || 30,
    						triadicVibrance: mini.tv ? ['', 'full', 'cascade', 'primary-muted', 'duotone-accent'][mini.tv] : 'equal',
    						neutralStrategy: mini.ns ? ['', 'true', 'complement', 'offset'][mini.ns] : 'tinted',
    						neutralDepth: mini.nd || 8,
    						neutralSpread: mini.nsp || 25,
    						monochromaticSpread: mini.ms || 35,
    						accentBrightnessShift: mini.ab || 0,
    						accentSaturationShift: mini.as || 0,
    						complementaryBalance: mini.cb || 70,
    						complementaryTension: mini.ct || 0,
    						complementaryBrightnessMode: mini.cm === 1 ? 'dark' : 'light',
    						analogousRange: mini.ar || 60,
    						analogousColorCount: mini.ac || 3,
    						analogousDistribution: mini.ad ? ['', 'gradual', 'clustered'][mini.ad] : 'even',
    						warmCoolMode: mini.wm === 1 ? '2:2' : '1:3',
    						warmCoolContrast: mini.wc ? ['', 'subtle', 'strong'][mini.wc] : 'moderate',
    						temperatureShift: mini.ts || 0,
    						tetradicPairingMode: mini.tp ? ['', 'square', 'double-split'][mini.tp] : 'rectangle',
    						tetradicDominance: mini.td || 50,
    						tetradicSaturationStrategy: mini.tss ? ['', 'alternating', 'gradual', 'primary-focus'][mini.tss] : 'all-equal',
    						splitEmphasis: mini.se ? ['', 'primary-focused', 'split-focused'][mini.se] : 'balanced',
    						splitSatDistribution: mini.ssd ? ['', 'cascade', 'diverge', 'primary-focus'][mini.ssd] : 'equal',
    						triadicBalanceMode: mini.tbm ? ['', 'major', 'minor', 'golden'][mini.tbm] : 'equal',
    						neutralPopIntensity: mini.npi || 100,
    						neutralBrightnessShift: mini.nbs || 0,
    					};
    					state.darkLightPreferences = {
    						monochromatic: { dark: 'recommended', light: 'recommended' },
    						dominant: { dark: 'recommended', light: 'recommended' },
    						neutralpop: { dark: 'recommended', light: 'recommended' },
    						analogous: { dark: 'recommended', light: 'recommended' },
    						complementary: { dark: 'recommended', light: 'recommended' },
    						warmcool: { dark: 'recommended', light: 'recommended' },
    						split: { dark: 'recommended', light: 'recommended' },
    						triadic: { dark: 'recommended', light: 'recommended' },
    						tetradic: { dark: 'recommended', light: 'recommended' }
    					};
    					if (mini.dlp) {
    						const paletteNames = ['monochromatic', 'dominant', 'neutralpop', 'analogous', 'complementary', 'warmcool', 'split', 'triadic', 'tetradic'];
    						Object.keys(mini.dlp).forEach(index => {
    							const paletteName = paletteNames[parseInt(index)];
    							if (paletteName) {
    								state.darkLightPreferences[paletteName] = {
    									dark: mini.dlp[index].d === 'r' ? 'recommended' : mini.dlp[index].d,
    									light: mini.dlp[index].l === 'r' ? 'recommended' : mini.dlp[index].l
    								};
    							}
    						});
    					}
    					state.darkLightAdvancedControls = {
    						monochromatic: { darkSat: 50, lightSat: 30, darkBright: -40, lightBright: 35 },
    						dominant: { darkSat: 30, lightSat: 20, darkBright: -40, lightBright: 30 },
    						neutralpop: { darkSat: 15, lightSat: 10, darkBright: -35, lightBright: 30 },
    						analogous: { darkSat: 40, lightSat: 35, darkBright: -45, lightBright: 25 },
    						complementary: { darkSat: 30, lightSat: 10, darkBright: -35, lightBright: 30 },
    						warmcool: { darkSat: 35, lightSat: 25, darkBright: -35, lightBright: 25 },
    						split: { darkSat: 40, lightSat: 20, darkBright: -40, lightBright: 20 },
    						triadic: { darkSat: 50, lightSat: 15, darkBright: -35, lightBright: 25 },
    						tetradic: { darkSat: 60, lightSat: 20, darkBright: -30, lightBright: 20 }
    					};
    					if (mini.dlc) {
    						const paletteNames = ['monochromatic', 'dominant', 'neutralpop', 'analogous', 'complementary', 'warmcool', 'split', 'triadic', 'tetradic'];
    						Object.keys(mini.dlc).forEach(index => {
    							const paletteName = paletteNames[parseInt(index)];
    							if (paletteName && mini.dlc[index]) {
    								state.darkLightAdvancedControls[paletteName] = {
    									darkSat: mini.dlc[index][0],
    									lightSat: mini.dlc[index][1],
    									darkBright: mini.dlc[index][2],
    									lightBright: mini.dlc[index][3]
    								};
    							}
    						});
    					}
    					state.lockedPalettes = {};
    					if (mini.lp) {
    						const paletteMap = {
    							'mon': 'monochromatic', 'dom': 'dominant-with-accents', 'neu': 'neutral-pop',
    							'ana': 'analogous', 'com': 'complementary', 'war': 'warm-cool-split',
    							'spl': 'split-complementary', 'tri': 'triadic', 'tet': 'tetradic'
    						};
    						Object.keys(mini.lp).forEach(shortKey => {
    							const fullKey = paletteMap[shortKey];
    							if (fullKey) {
    								state.lockedPalettes[fullKey] = {
    									hue: mini.lp[shortKey][0],
    									saturation: mini.lp[shortKey][1],
    									brightness: mini.lp[shortKey][2]
    								};
    							}
    						});
    					}
    					state.pinnedPaletteIds = mini.pp ? mini.pp.map(shortId => {
    						const map = {
    							'mon': 'monochromatic', 'dom': 'dominant-with-accents', 'neu': 'neutral-pop',
    							'ana': 'analogous', 'com': 'complementary', 'war': 'warm-cool-split',
    							'spl': 'split-complementary', 'tri': 'triadic', 'tet': 'tetradic'
    						};
    						return map[shortId] || shortId;
    					}) : [];
    					state.paletteBackgrounds = {};
    					if (mini.pb) {
    						const paletteMap = {
    							'mon': 'monochromatic', 'dom': 'dominant-with-accents', 'neu': 'neutral-pop',
    							'ana': 'analogous', 'com': 'complementary', 'war': 'warm-cool-split',
    							'spl': 'split-complementary', 'tri': 'triadic', 'tet': 'tetradic'
    						};
    						Object.keys(mini.pb).forEach(shortKey => {
    							const fullKey = paletteMap[shortKey];
    							if (fullKey) {
    								state.paletteBackgrounds[fullKey] = '#' + mini.pb[shortKey];
    							}
    						});
    					}
    					return state;
    				} catch (e) {
    					console.error('Failed to decompress state:', e);
    					return null;
    				}
    			}
    			const MAX_PINS = 3;
    			let pinnedPaletteElements = [];
    			const HISTORY_LIMIT = 20;
    			let history = [];
    			let redoStack = [];
    			let isApplyingState = false; // Flag to prevent feedback loops
    			const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    			const BRIGHTNESS_RANGE = 45;
    			const SECONDARY_SATURATION_RATIO = 0.9;
    			const ACCENT_SATURATION_BOOST = 1.2;
    			const BRIGHTNESS_VARIATION_FACTOR = 0.33;
    			const GRADUAL_DISTRIBUTION_POWER = 2.5;
    			const CLUSTERED_DISTRIBUTION_POWER = 0.3;
    			const BRIDGE_COLOR_SATURATION = 0.4;
    			const COMPLEMENT_MIN_SATURATION = 0.2;
    			const COMPLEMENT_MAX_SATURATION = 0.8;
    			let selectedHue = 217;
    			let baseSaturation = 75;
    			let baseBrightness = 60;
    			let displayFormat = 'HEX';
    			let advancedControlsActive = false;
    			let lockedPalettes = {}; // { paletteId: { hue, saturation, brightness } }
    			let paletteBackgrounds = {}; // { paletteId: '#colorcode' }
    			let accentHueShift = 0;
    			let invertDirection = false;
    			let dominantRelationship = '30°';
    			let accentIntensity = 70;
    			let dominantDistribution = 60;
    			let splitAngle = 30;
    			let triadicVibrance = 'equal';
    			let neutralStrategy = 'tinted';
    			let neutralDepth = 8;
    			let monochromaticSpread = 35;
    			let accentBrightnessShift = 0;
    			let accentSaturationShift = 0;
    			let complementaryBalance = 70;
    			let complementaryTension = 0;
    			let complementaryBrightnessMode = 'light';
    			let analogousRange = 60; 
    			let analogousColorCount = 3;
    			let analogousDistribution = 'even';
    			let warmCoolMode = '1:3';
    			let warmCoolContrast = 'moderate';
    			let temperatureShift = 0;
    			let tetradicPairingMode = 'rectangle';
    			let tetradicDominance = 50;
    			let tetradicSaturationStrategy = 'all-equal';
    			let splitEmphasis = 'balanced';
    			let splitSatDistribution = 'equal';
    			let triadicBalanceMode = 'equal';
    			let neutralPopIntensity = 100;
    			let neutralBrightnessShift = 0;
    			let neutralSpread = 25; // New slider's variable
    			let darkLightPreferences = {
    				monochromatic: { dark: 'recommended', light: 'recommended' },
    				dominant: { dark: 'recommended', light: 'recommended' },
    				neutralpop: { dark: 'recommended', light: 'recommended' },
    				analogous: { dark: 'recommended', light: 'recommended' },
    				complementary: { dark: 'recommended', light: 'recommended' },
    				warmcool: { dark: 'recommended', light: 'recommended' },
    				split: { dark: 'recommended', light: 'recommended' },
    				triadic: { dark: 'recommended', light: 'recommended' },
    				tetradic: { dark: 'recommended', light: 'recommended' }
    			};
    			let darkLightAdvancedControls = {
    				monochromatic: { darkSat: 50, lightSat: 30, darkBright: -40, lightBright: 35 },
    				dominant: { darkSat: 30, lightSat: 20, darkBright: -40, lightBright: 30 },
    				neutralpop: { darkSat: 15, lightSat: 10, darkBright: -35, lightBright: 30 },
    				analogous: { darkSat: 40, lightSat: 35, darkBright: -45, lightBright: 25 },
    				complementary: { darkSat: 30, lightSat: 10, darkBright: -35, lightBright: 30 },
    				warmcool: { darkSat: 35, lightSat: 25, darkBright: -35, lightBright: 25 },
    				split: { darkSat: 40, lightSat: 20, darkBright: -40, lightBright: 20 },
    				triadic: { darkSat: 50, lightSat: 15, darkBright: -35, lightBright: 25 },
    				tetradic: { darkSat: 60, lightSat: 20, darkBright: -30, lightBright: 20 }
    			};
    			const STORAGE_KEY = 'colorPaletteState';
    			const AUTO_SAVE_DELAY = 1000; // Save 1 second after last change
    			let autoSaveTimer = null;
    			let currentOpenFile = null;     // { handle: FileHandle, name: 'filename.cgp' }
    			let hasUnsavedFileChanges = false;  // Track changes since last manual save
    			let hasRestoredSession = false;
    			const FILE_EXTENSION = '.cgp';  // Color Generator Palette
    			function saveToLocalStorage() {
    				try {
    					const state = getCurrentState();
    					localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    					console.log('State auto-saved to localStorage');
    					showSaveIndicator(); // Optional: show visual feedback
    					return true;
    				} catch (e) {
    					console.error('Failed to save to localStorage:', e);
    					return false;
    				}
    			}
    			function loadFromLocalStorage() {
    				try {
    					const saved = localStorage.getItem(STORAGE_KEY);
    					if (saved) {
    						const state = JSON.parse(saved);
    						console.log('Restoring saved state from localStorage');
    						hasRestoredSession = true;
    						if (state.fileInfo) {
    							hasUnsavedFileChanges = true;
    						}
    						return state;
    					}
    				} catch (e) {
    					console.error('Failed to load from localStorage:', e);
    					localStorage.removeItem(STORAGE_KEY);
    				}
    				return null;
    			}
    			function performClearSavedData() {
    				localStorage.removeItem(STORAGE_KEY);
    				localStorage.removeItem('hasSeenColorPaletteWelcome');
    				console.log('Cleared saved state from localStorage');
    				showSaveIndicator(); // Reuse indicator to show "Cleared"
    				setTimeout(() => {
    					const indicator = document.getElementById('autoSaveIndicator');
    					if (indicator) {
    						indicator.innerHTML = '✓ Cleared';
    					}
    				}, 10);
    				setTimeout(() => window.location.reload(), 500);
    			}
    			function showClearDataConfirmation() {
    				const overlay = document.getElementById('confirmClearOverlay');
    				const confirmBtn = document.getElementById('confirmClearBtn');
    				const cancelBtn = document.getElementById('confirmCancelBtn');
    				if (!overlay || !confirmBtn || !cancelBtn) return;
    				const hidePopup = () => {
    					overlay.classList.remove('visible');
    				};
    				const confirmAction = () => {
    					performClearSavedData();
    					hidePopup();
    					confirmBtn.removeEventListener('click', confirmAction);
    					cancelBtn.removeEventListener('click', hidePopup);
    					overlay.removeEventListener('click', overlayClick);
    				};
    				const overlayClick = (e) => {
    					if (e.target === overlay) {
    						hidePopup();
    					}
    				};
    				confirmBtn.addEventListener('click', confirmAction, { once: true }); // Use {once: true} for safety
    				cancelBtn.addEventListener('click', hidePopup, { once: true });
    				overlay.addEventListener('click', overlayClick);
    				overlay.classList.add('visible');
    			}
    			function showNewProjectConfirmation() {
    				let overlay = document.getElementById('confirmNewProjectOverlay');
    				if (!overlay) {
    					overlay = document.createElement('div');
    					overlay.className = 'confirm-overlay';
    					overlay.id = 'confirmNewProjectOverlay';
    					overlay.innerHTML = `
    						<div class="confirm-popup">
    							<div class="confirm-header">
    								<h3 class="confirm-title">Create New Project?</h3>
    							</div>
    							<div class="confirm-content">
    								<p>You have unsaved changes in your current project.</p>
    								<p>Would you like to save before creating a new project? <strong>Unsaved changes will be lost.</strong></p>
    							</div>
    							<div class="confirm-footer">
    								<button class="confirm-btn cancel" id="newProjectCancelBtn">Cancel</button>
    								<button class="confirm-btn confirm" style="background: #5BA7F7; border-color: #5BA7F7;" id="newProjectSaveBtn">Save & Continue</button>
    								<button class="confirm-btn confirm" id="newProjectDiscardBtn">Discard Changes</button>
    							</div>
    						</div>
    					`;
    					APP_CONTAINER.appendChild(overlay);
    				}
    				const cancelBtn = document.getElementById('newProjectCancelBtn');
    				const saveBtn = document.getElementById('newProjectSaveBtn');
    				const discardBtn = document.getElementById('newProjectDiscardBtn');
    				const hidePopup = () => {
    					overlay.classList.remove('visible');
    				};
    				const saveAndContinue = async () => {
    					hidePopup();
    					await saveFile(); // Save current work
    					currentOpenFile = null;
    					hasUnsavedFileChanges = false;
    					hasRestoredSession = false;
    					localStorage.removeItem(STORAGE_KEY);
    					window.location.reload();
    				};
    				const discardAndContinue = () => {
    					hidePopup();
    					currentOpenFile = null;
    					hasUnsavedFileChanges = false;
    					hasRestoredSession = false;
    					localStorage.removeItem(STORAGE_KEY);
    					window.location.reload();
    				};
    				const overlayClick = (e) => {
    					if (e.target === overlay) {
    						hidePopup();
    					}
    				};
    				cancelBtn.addEventListener('click', hidePopup, { once: true });
    				saveBtn.addEventListener('click', saveAndContinue, { once: true });
    				discardBtn.addEventListener('click', discardAndContinue, { once: true });
    				overlay.addEventListener('click', overlayClick);
    				overlay.classList.add('visible');
    			}			
    			function autoSave() {
    				clearTimeout(autoSaveTimer);
    				autoSaveTimer = setTimeout(() => {
    					const saved = saveToLocalStorage();
    					if ((currentOpenFile || hasRestoredSession) && !isApplyingState) {
    						hasUnsavedFileChanges = true;
    						updateFileStatus();
    					}
    				}, AUTO_SAVE_DELAY);
    			}
    			const originalSaveState = saveState;
    			saveState = function() {
    				originalSaveState();
    				if (currentOpenFile && !isApplyingState) {
    					hasUnsavedFileChanges = true;
    					updateFileStatus();
    				}
    			};			
    			function updateFileStatus() {
    				const titleGroup = document.querySelector('.app-title-group');
    				let statusEl = titleGroup.querySelector('.file-status');
    				if (!statusEl) {
    					statusEl = document.createElement('span');
    					statusEl.className = 'file-status';
    					titleGroup.appendChild(statusEl);
    				}
    				let mobileStatusRow = document.querySelector('.file-status-row');
    				if (!mobileStatusRow) {
    					mobileStatusRow = document.createElement('div');
    					mobileStatusRow.className = 'file-status-row';
    					const mobileStatusEl = document.createElement('div');
    					mobileStatusEl.className = 'file-status-mobile';
    					mobileStatusRow.appendChild(mobileStatusEl);
    					const appHeader = document.querySelector('.app-header');
    					appHeader.insertAdjacentElement('afterend', mobileStatusRow);
    				}
    				let mobileStatusEl = mobileStatusRow.querySelector('.file-status-mobile');
    				let displayText = '';
    				let isUnsaved = false;
    				if (currentOpenFile) {
    					const maxLengthDesktop = 25;
    					let maxLengthMobile;
    					if (window.innerWidth < 380) {
    						maxLengthMobile = 28; // Very small screens
    					} else if (window.innerWidth < 480) {
    						maxLengthMobile = 32; // Small screens
    					} else if (window.innerWidth < 768) {
    						maxLengthMobile = 38; // Medium mobile screens
    					} else {
    						maxLengthMobile = 40; // Tablets
    					}
    					const restoredSuffix = ' (restored)';
    					const needsRestoredTag = !currentOpenFile.handle;
    					let displayNameDesktop = truncateFileName(
    						currentOpenFile.name, 
    						maxLengthDesktop, 
    						needsRestoredTag ? restoredSuffix : ''
    					);
    					let displayNameMobile = truncateFileName(
    						currentOpenFile.name, 
    						maxLengthMobile, 
    						needsRestoredTag ? restoredSuffix : ''
    					);
    					statusEl.textContent = displayNameDesktop;
    					mobileStatusEl.textContent = displayNameMobile;
    					isUnsaved = hasUnsavedFileChanges;
    				} else {
    					displayText = 'Unsaved project';
    					statusEl.textContent = displayText;
    					mobileStatusEl.textContent = displayText;
    					isUnsaved = true;
    				}
    				statusEl.classList.toggle('unsaved', isUnsaved);
    				mobileStatusEl.classList.toggle('unsaved', isUnsaved);
    			}
    			function truncateFileName(filename, maxLength, suffix = '') {
    				const availableLength = maxLength - suffix.length;
    				let displayName = filename;
    				if (displayName.length > availableLength) {
    					const extension = '.cgp';
    					const nameWithoutExt = displayName.slice(0, -extension.length);
    					const spaceForName = availableLength - extension.length;
    					if (nameWithoutExt.length > spaceForName) {
    						const startChars = Math.floor(spaceForName * 0.4) - 1;
    						const endChars = spaceForName - startChars - 3;
    						const firstPart = nameWithoutExt.slice(0, Math.max(0, startChars));
    						const lastPart = nameWithoutExt.slice(-Math.max(0, endChars));
    						displayName = firstPart + '...' + lastPart + extension;
    					}
    				}
    				return displayName + suffix;
    			}
    			async function newProject() {
    				const hasChangesToSave = hasUnsavedFileChanges || 
    										(!currentOpenFile && (history.length > 1 || hasRestoredSession)) ||
    										(currentOpenFile && !currentOpenFile.handle && hasRestoredSession);
    				if (hasChangesToSave) {
    					showNewProjectConfirmation();
    					return;
    				}
    				currentOpenFile = null;
    				hasUnsavedFileChanges = false;
    				hasRestoredSession = false;
    				localStorage.removeItem(STORAGE_KEY);
    				window.location.reload();
    			}
    			async function openFile() {
    				try {
    					const [fileHandle] = await window.showOpenFilePicker({
    						types: [{
    							description: 'Color Palette Files',
    							accept: { 'application/cgp': ['.cgp'] }
    						}],
    						multiple: false
    					});
    					const file = await fileHandle.getFile();
    					const contents = await file.text();
    					const state = JSON.parse(contents);
    					applyState(state);
    					currentOpenFile = {
    						handle: fileHandle,
    						name: file.name
    					};
    					hasUnsavedFileChanges = false;
    					localStorage.removeItem(STORAGE_KEY);
    					updateFileStatus();
    					updateUndoRedoButtons();
    					updateColorsAndDisplays();
    				} catch (err) {
    					if (err.name !== 'AbortError') {
    						console.error('Failed to open file:', err);
    						alert('Failed to open file. Make sure it\'s a valid .cgp file.');
    					}
    				}
    			}
    			async function saveFile() {
    				if (currentOpenFile && !currentOpenFile.handle) {
    					const suggestedName = currentOpenFile.name || 'palette.cgp';
    					try {
    						const fileHandle = await window.showSaveFilePicker({
    							suggestedName: suggestedName,
    							types: [{
    								description: 'Color Palette Files',
    								accept: { 'application/cgp': ['.cgp'] }
    							}]
    						});
    						const writable = await fileHandle.createWritable();
    						const state = getCurrentState();
    						delete state.fileInfo;
    						delete state.hasRestoredSession;
    						await writable.write(JSON.stringify(state, null, 2));
    						await writable.close();
    						currentOpenFile = {
    							handle: fileHandle,
    							name: fileHandle.name || suggestedName
    						};
    						hasUnsavedFileChanges = false;
    						hasRestoredSession = false; // Clear the restored session flag
    						updateFileStatus();
    						showSaveIndicator();
    					} catch (err) {
    						if (err.name !== 'AbortError') {
    							console.error('Failed to save file:', err);
    							alert('Failed to save file. Please try again.');
    						}
    					}
    					return;
    				}
    				if (!currentOpenFile || !currentOpenFile.handle) {
    					await saveAsFile();
    					return;
    				}
    				try {
    					const writable = await currentOpenFile.handle.createWritable();
    					const state = getCurrentState();
    					delete state.fileInfo;
    					delete state.hasRestoredSession;
    					await writable.write(JSON.stringify(state, null, 2));
    					await writable.close();
    					hasUnsavedFileChanges = false;
    					hasRestoredSession = false; // Clear the restored session flag
    					updateFileStatus();
    					showSaveIndicator();
    				} catch (err) {
    					console.error('Failed to save file:', err);
    					alert('Failed to save file. Please try Save As instead.');
    				}
    			}	
    			async function saveAsFile() {
    				try {
    					const suggestedName = currentOpenFile ? currentOpenFile.name : 'palette.cgp';
    					const fileHandle = await window.showSaveFilePicker({
    						suggestedName: suggestedName,
    						types: [{
    							description: 'Color Palette Files',
    							accept: { 'application/cgp': ['.cgp'] }
    						}]
    					});
    					const state = getCurrentState();
    					delete state.fileInfo;
    					delete state.hasRestoredSession;
    					const writable = await fileHandle.createWritable();
    					await writable.write(JSON.stringify(state, null, 2));
    					await writable.close();
    					currentOpenFile = {
    						handle: fileHandle,
    						name: fileHandle.name
    					};
    					hasUnsavedFileChanges = false;
    					hasRestoredSession = false; 
    					updateFileStatus();
    					showSaveIndicator();
    				} catch (err) {
    					if (err.name !== 'AbortError') {
    						console.error('Failed to save file:', err);
    						alert('Failed to save file as. Please try again.');
    					}
    				}
    			}			
    			function showSaveIndicator() {
    				const existing = document.getElementById('autoSaveIndicator');
    				if (existing) existing.remove();
    				const indicator = document.createElement('div');
    				indicator.id = 'autoSaveIndicator';
    				indicator.innerHTML = `
    					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    						<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    						<polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    						<polyline points="7 3 7 8 15 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    					</svg>
    				`;
    				indicator.style.cssText = `
    					position: fixed;
    					bottom: 20px;
    					left: 20px;
    					width: 32px;
    					height: 32px;
    					background: rgba(91, 167, 247, 0.9);
    					color: white;
    					display: flex;
    					align-items: center;
    					justify-content: center;
    					border-radius: 50%;
    					opacity: 0;
    					transform: scale(0.8);
    					transition: all 0.3s ease;
    					z-index: 1000;
    					pointer-events: none;
    					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    				`;
    				APP_CONTAINER.appendChild(indicator);
    				requestAnimationFrame(() => {
    					indicator.style.opacity = '0.8';
    					indicator.style.transform = 'scale(1)';
    				});
    				setTimeout(() => {
    					indicator.style.opacity = '0';
    					indicator.style.transform = 'scale(0.8)';
    					setTimeout(() => indicator.remove(), 300);
    				}, 1000);
    			}
    			function getCurrentState() {
    				const pinnedPaletteIds = pinnedPaletteElements.map(el => el.dataset.paletteId);
    				const state = {
    					selectedHue, baseSaturation, baseBrightness, displayFormat, advancedControlsActive,
    					accentHueShift, invertDirection, dominantRelationship, accentIntensity, dominantDistribution,
    					splitAngle, triadicVibrance, neutralStrategy, neutralDepth, neutralSpread,
    					monochromaticSpread,
    					accentBrightnessShift, accentSaturationShift, complementaryBalance, complementaryTension,
    					complementaryBrightnessMode, analogousRange, analogousColorCount, analogousDistribution,
    					warmCoolMode, warmCoolContrast, temperatureShift, tetradicPairingMode, tetradicDominance,
    					tetradicSaturationStrategy, splitEmphasis, splitSatDistribution, triadicBalanceMode,
    					neutralPopIntensity, neutralBrightnessShift,
    					darkLightPreferences: JSON.parse(JSON.stringify(darkLightPreferences)),
    					darkLightAdvancedControls: JSON.parse(JSON.stringify(darkLightAdvancedControls)),
    					lockedPalettes: JSON.parse(JSON.stringify(lockedPalettes)),
    					paletteBackgrounds: JSON.parse(JSON.stringify(paletteBackgrounds)),
    					pinnedPaletteIds: pinnedPaletteIds,
    					fileInfo: currentOpenFile ? {
    						name: currentOpenFile.name,
    						hasUnsavedChanges: hasUnsavedFileChanges
    					} : null,
    					hasRestoredSession: hasRestoredSession
    				};
    				return state;
    			}
    			function applyState(state, isUndoRedo = false) {
    				isApplyingState = true;
    				const preservedFormat = displayFormat;
    				const preservedAdvanced = advancedControlsActive;
    				try {
    					if (!isUndoRedo) {
    						if (state.fileInfo) {
    							currentOpenFile = { 
    								name: state.fileInfo.name,
    								handle: null // Handle is lost when restoring from localStorage
    							};
    							hasUnsavedFileChanges = state.fileInfo.hasUnsavedChanges || false;
    							hasRestoredSession = true; // Mark that this is a restored session
    						} else {
    							currentOpenFile = null;
    							hasUnsavedFileChanges = false;
    						}
    						if (state.hasRestoredSession) {
    							hasRestoredSession = true;
    						}
    					}			
    					selectedHue = state.selectedHue;
    					baseSaturation = state.baseSaturation;
    					baseBrightness = state.baseBrightness;
    					displayFormat = state.displayFormat;
    					advancedControlsActive = state.advancedControlsActive;
    					accentHueShift = state.accentHueShift;
    					invertDirection = state.invertDirection;
    					dominantRelationship = state.dominantRelationship;
    					accentIntensity = state.accentIntensity;
    					dominantDistribution = state.dominantDistribution;
    					splitAngle = state.splitAngle;
    					triadicVibrance = state.triadicVibrance;
    					neutralStrategy = state.neutralStrategy;
    					neutralDepth = state.neutralDepth;
    					neutralSpread = state.neutralSpread;
    					monochromaticSpread = state.monochromaticSpread;
    					accentBrightnessShift = state.accentBrightnessShift;
    					accentSaturationShift = state.accentSaturationShift;
    					complementaryBalance = state.complementaryBalance;
    					complementaryTension = state.complementaryTension;
    					complementaryBrightnessMode = state.complementaryBrightnessMode;
    					analogousRange = state.analogousRange;
    					analogousColorCount = state.analogousColorCount;
    					analogousDistribution = state.analogousDistribution;
    					warmCoolMode = state.warmCoolMode;
    					warmCoolContrast = state.warmCoolContrast;
    					temperatureShift = state.temperatureShift;
    					tetradicPairingMode = state.tetradicPairingMode;
    					tetradicDominance = state.tetradicDominance;
    					tetradicSaturationStrategy = state.tetradicSaturationStrategy;
    					splitEmphasis = state.splitEmphasis;
    					splitSatDistribution = state.splitSatDistribution;
    					triadicBalanceMode = state.triadicBalanceMode;
    					neutralPopIntensity = state.neutralPopIntensity;
    					neutralBrightnessShift = state.neutralBrightnessShift;
    					darkLightPreferences = JSON.parse(JSON.stringify(state.darkLightPreferences));
    					darkLightAdvancedControls = JSON.parse(JSON.stringify(state.darkLightAdvancedControls));
    					if (state.lockedPalettes) {
    						lockedPalettes = JSON.parse(JSON.stringify(state.lockedPalettes));
    					}
    					if (state.pinnedPaletteIds && Array.isArray(state.pinnedPaletteIds)) {
    						document.querySelectorAll('.cg-palette-section').forEach(section => {
    							section.style.order = '';
    							section.classList.remove('pinned');
    						});
    						pinnedPaletteElements = [];
    						state.pinnedPaletteIds.forEach((paletteId, index) => {
    							const section = document.querySelector(`[data-palette-id="${paletteId}"]`);
    							if (section) {
    								section.classList.add('pinned');
    								pinnedPaletteElements.push(section);
    								section.style.order = -(state.pinnedPaletteIds.length - index);
    							}
    						});
    					}
    					if (state.paletteBackgrounds) {
    						paletteBackgrounds = JSON.parse(JSON.stringify(state.paletteBackgrounds));
    					} else {
    						paletteBackgrounds = {}; // Ensure it's reset if not in state
    					}
    					document.querySelectorAll('.cg-palette-section').forEach(section => {
    						const paletteId = section.dataset.paletteId;
    						section.classList.toggle('locked', !!lockedPalettes[paletteId]);
    						if (paletteBackgrounds[paletteId]) {
    							setPaletteBackground(section, paletteBackgrounds[paletteId], false); // Don't save state again
    						} else {
    							resetPaletteBackground(section, false); // Don't save state again
    						}
    					});
    					if (isUndoRedo) {
    						displayFormat = preservedFormat;
    						advancedControlsActive = preservedAdvanced;
    					}
    					updateUIFromState();
    					updateColorsAndDisplays();
    				} finally {
    					isApplyingState = false;
    					if (!isUndoRedo) {
    						checkForChanges();
    					}
    					updateFileStatus();
    				}
    			}
    			function saveState() {
    				if (isApplyingState) return;
    				redoStack = []; // Clear redo stack on new action
    				const currentState = getCurrentState();
    				if (history.length > 0) {
    					const lastState = history[history.length - 1];
    					if (JSON.stringify(lastState) === JSON.stringify(currentState)) {
    						return;
    					}
    				}
    				history.push(currentState);
    				if (history.length > HISTORY_LIMIT) {
    					history.shift();
    				}
    				updateUndoRedoButtons();
    				checkForChanges();
    				autoSave();
    			}
    			function undo() {
    				if (history.length <= 1) return;
    				const currentState = history.pop();
    				redoStack.push(currentState);
    				const prevState = history[history.length - 1];
    				applyState(prevState, true);
    				updateUndoRedoButtons();
    				checkForChanges();
    			}
    			function redo() {
    				if (redoStack.length === 0) return;
    				const nextState = redoStack.pop();
    				history.push(nextState);
    				applyState(nextState, true);
    				updateUndoRedoButtons();
    				checkForChanges();
    			}
    			function updateUndoRedoButtons() {
    				const undoBtn = document.getElementById('undoBtn');
    				const redoBtn = document.getElementById('redoBtn');
    				if (undoBtn) {
    					undoBtn.disabled = history.length <= 1;
    				}
    				if (redoBtn) {
    					redoBtn.disabled = redoStack.length === 0;
    				}
    			}
    			async function animatePinning(paletteToPin) {
    				const container = document.getElementById('cgPalettesContainer');
    				const palettes = Array.from(container.querySelectorAll('.cg-palette-section'));
    				const firstPositions = new Map();
    				palettes.forEach(p => {
    					firstPositions.set(p, p.getBoundingClientRect());
    				});
    				const isPinned = paletteToPin.classList.contains('pinned');
    				const paletteId = paletteToPin.dataset.paletteId;
    				paletteToPin.classList.remove('reordering');
    				if (isPinned) {
    					paletteToPin.classList.remove('pinned');
    					pinnedPaletteElements = pinnedPaletteElements.filter(p => p.dataset.paletteId !== paletteId);
    				} else {
    					if (pinnedPaletteElements.length >= MAX_PINS) {
    						const oldestPinned = pinnedPaletteElements.pop();
    						oldestPinned.classList.remove('pinned');
    					}
    					paletteToPin.classList.add('pinned');
    					pinnedPaletteElements.unshift(paletteToPin);
    				}
    				palettes.forEach(p => p.style.order = p.classList.contains('pinned') ? -1 : 0);
    				pinnedPaletteElements.forEach((p, index) => {
    					p.style.order = -(pinnedPaletteElements.length - index);
    				});
    				palettes.forEach(p => {
    					const lastPosition = p.getBoundingClientRect();
    					const firstPosition = firstPositions.get(p);
    					const deltaX = firstPosition.left - lastPosition.left;
    					const deltaY = firstPosition.top - lastPosition.top;
    					if (deltaX === 0 && deltaY === 0) return;
    					p.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    					p.style.transition = 'transform 0s'; // Apply the change instantly
    				});
    				requestAnimationFrame(() => {
    					palettes.forEach(p => {
    						p.style.transition = 'transform 0.4s ease-in-out';
    						p.style.transform = ''; // Animate to default transform (translate(0,0))
    					});
    				});
    				await new Promise(resolve => setTimeout(resolve, 400));
    				palettes.forEach(p => {
    					p.style.transform = '';
    					p.style.transition = '';
    				});
    				saveState();
    			}
    			function rybToRgbHue(rybHue) {
    				rybHue = ((rybHue % 360) + 360) % 360;
    				if (rybHue >= 0 && rybHue < 60) {
    					return (rybHue / 60) * 30;
    				} else if (rybHue >= 60 && rybHue < 120) {
    					return 30 + ((rybHue - 60) / 60) * 30;
    				} else if (rybHue >= 120 && rybHue < 180) {
    					return 60 + ((rybHue - 120) / 60) * 60;
    				} else if (rybHue >= 180 && rybHue < 240) {
    					return 120 + ((rybHue - 180) / 60) * 120;
    				} else if (rybHue >= 240 && rybHue < 300) {
    					return 240 + ((rybHue - 240) / 60) * 60;
    				} else {
    					return 300 + ((rybHue - 300) / 60) * 60;
    				}
    			}
    			function rgbToRybHue(rgbHue) {
    				rgbHue = ((rgbHue % 360) + 360) % 360;
    				if (rgbHue >= 0 && rgbHue < 30) {
    					return (rgbHue / 30) * 60;
    				} else if (rgbHue >= 30 && rgbHue < 60) {
    					return 60 + ((rgbHue - 30) / 30) * 60;
    				} else if (rgbHue >= 60 && rgbHue < 120) {
    					return 120 + ((rgbHue - 60) / 60) * 60;
    				} else if (rgbHue >= 120 && rgbHue < 240) {
    					return 180 + ((rgbHue - 120) / 120) * 60;
    				} else if (rgbHue >= 240 && rgbHue < 300) {
    					return 240 + ((rgbHue - 240) / 60) * 60;
    				} else {
    					return 300 + ((rgbHue - 300) / 60) * 60;
    				}
    			}
    			function getRybComplement(rybHue) {
    				return (rybHue + 180) % 360;
    			}
    			function hslToRgb(h, s, l) {
    				s /= 100;
    				l /= 100;
    				const c = (1 - Math.abs(2 * l - 1)) * s;
    				const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    				const m = l - c / 2;
    				let r = 0, g = 0, b = 0;
    				if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    				else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    				else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    				else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    				else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    				else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
    				r = Math.round((r + m) * 255);
    				g = Math.round((g + m) * 255);
    				b = Math.round((b + m) * 255);
    				return { r, g, b };
    			}
    			function hslToHex(h, s, l) {
    				const rgb = hslToRgb(h, s, l);
    				return "#" + [rgb.r, rgb.g, rgb.b].map(val => val.toString(16).padStart(2, '0')).join('');
    			}
    			function rgbToHsl(r, g, b) {
    				r /= 255; g /= 255; b /= 255;
    				const max = Math.max(r, g, b), min = Math.min(r, g, b);
    				let h, s, l = (max + min) / 2;
    				if (max === min) {
    					h = s = 0; // achromatic
    				} else {
    					const d = max - min;
    					s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    					switch (max) {
    						case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    						case g: h = (b - r) / d + 2; break;
    						case b: h = (r - g) / d + 4; break;
    					}
    					h /= 6;
    				}
    				return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    			}
    			function hexToHsl(hex) {
    				hex = hex.replace(/^#/, '');
    				const r = parseInt(hex.slice(0, 2), 16);
    				const g = parseInt(hex.slice(2, 4), 16);
    				const b = parseInt(hex.slice(4, 6), 16);
    				return rgbToHsl(r, g, b);
    			}
    			function formatColorForDisplay(h, s, l, format) {
    				const rgb = hslToRgb(h, s, l);
    				switch (format) {
    					case 'RGB':
    						return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    					case 'HSL':
    						return `${h}, ${s}%, ${l}%`;
    					case 'CSS_RGB':
    						return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    					case 'CSS_HSL':
    						return `hsl(${h}, ${s}%, ${l}%)`;
    					case 'HEX':
    					default:
    						return hslToHex(h, s, l);
    				}
    			}
    			function parseColorString(str) {
    				str = str.trim().toLowerCase();
    				let match;
    				match = str.match(/^hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/);
    				if (match) {
    					const h = parseInt(match[1]), s = parseInt(match[2]), l = parseInt(match[3]);
    					if (h <= 360 && s <= 100 && l <= 100) return { h, s, l };
    				}
    				match = str.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/);
    				if (match) {
    					const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
    					if (r <= 255 && g <= 255 && b <= 255) return rgbToHsl(r, g, b);
    				}
    				match = str.match(/^#?([0-9a-f]{6})$/);
    				if (match) return hexToHsl('#' + match[1]);
    				match = str.match(/^#?([0-9a-f]{3})$/);
    				if (match) {
    					const [r, g, b] = match[1].split('').map(c => c + c);
    					return hexToHsl('#' + r + g + b);
    				}
    				match = str.match(/^(\d{1,3})\s*[,\s]\s*(\d{1,3})%?\s*[,\s]\s*(\d{1,3})%?$/);
    				if (match) {
    					const v1 = parseInt(match[1]), v2 = parseInt(match[2]), v3 = parseInt(match[3]);
    					if (v1 > 360 || v2 > 100 || v3 > 100) {
    						if (v1 <= 255 && v2 <= 255 && v3 <= 255) return rgbToHsl(v1, v2, v3);
    					} else if (v1 > 100 || v2 > 100 || v3 > 100) {
    						if (v1 <= 255 && v2 <= 255 && v3 <= 255) return rgbToHsl(v1, v2, v3);
    					} else {
    						if (displayFormat === 'RGB' || displayFormat === 'CSS_RGB') {
    							return rgbToHsl(v1, v2, v3);
    						} else {
    							if (v1 <= 360 && v2 <= 100 && v3 <= 100) return { h: v1, s: v2, l: v3 };
    						}
    					}
    				}
    				match = str.match(/^(\d{1,3})\s+(\d{1,3})%?\s+(\d{1,3})%?$/);
    				if (match) {
    					const v1 = parseInt(match[1]), v2 = parseInt(match[2]), v3 = parseInt(match[3]);
    					if (v1 > 100 || v2 > 100 || v3 > 100) {
    						if (v1 <= 255 && v2 <= 255 && v3 <= 255) return rgbToHsl(v1, v2, v3);
    					} else {
    						if (displayFormat === 'RGB' || displayFormat === 'CSS_RGB') {
    							return rgbToHsl(v1, v2, v3);
    						} else if (v1 <= 360 && v2 <= 100 && v3 <= 100) {
    							return { h: v1, s: v2, l: v3 };
    						}
    					}
    				}
    				return null;
    			}
    			function createTheoryColor(theoryHue, saturation, lightness) {
    				const displayHue = rybToRgbHue(theoryHue);
    				const clampedSaturation = Math.max(0, Math.min(100, saturation));
    				const clampedLightness = Math.max(0, Math.min(100, lightness));
    				return hslToHex(displayHue, clampedSaturation, clampedLightness);
    			}
    			function getPaletteDefaults(paletteType) {
    				const defaults = {
    					monochromatic: {
    						monochromaticSpread: 35,
    						accentHueShift: 0,
    						accentBrightnessShift: 0,
    						accentSaturationShift: 0,
    						darkLightPrefs: { dark: 'recommended', light: 'recommended' },
    						darkLightControls: { darkSat: 50, lightSat: 30, darkBright: -40, lightBright: 35 }
    					},
    					dominant: {
    						accentIntensity: 70,
    						dominantRelationship: '30°',
    						dominantDistribution: 60,
    						darkLightPrefs: { dark: 'recommended', light: 'recommended' },
    						darkLightControls: { darkSat: 30, lightSat: 20, darkBright: -40, lightBright: 30 }
    					},
    					neutralpop: {
    						neutralSpread: 25,
    						neutralStrategy: 'tinted',
    						neutralDepth: 8,
    						neutralBrightnessShift: 0,
    						darkLightPrefs: { dark: 'recommended', light: 'recommended' },
    						darkLightControls: { darkSat: 15, lightSat: 10, darkBright: -35, lightBright: 30 }
    					},
    					analogous: {
    						analogousRange: 60,
    						analogousColorCount: 3,
    						analogousDistribution: 'even',
    						darkLightPrefs: { dark: 'recommended', light: 'recommended' },
    						darkLightControls: { darkSat: 40, lightSat: 35, darkBright: -45, lightBright: 25 }
    					},
    					complementary: {
    						complementaryBalance: 70,
    						complementaryTension: 0,
    						complementaryBrightnessMode: 'light',
    						darkLightPrefs: { dark: 'recommended', light: 'recommended' },
    						darkLightControls: { darkSat: 30, lightSat: 10, darkBright: -35, lightBright: 30 }
    					},
    					warmcool: {
    						warmCoolMode: '1:3',
    						warmCoolContrast: 'moderate',
    						temperatureShift: 0,
    						darkLightPrefs: { dark: 'recommended', light: 'recommended' },
    						darkLightControls: { darkSat: 35, lightSat: 25, darkBright: -35, lightBright: 25 }
    					},
    					split: {
    						splitAngle: 30,
    						splitEmphasis: 'balanced',
    						splitSatDistribution: 'equal',
    						darkLightPrefs: { dark: 'recommended', light: 'recommended' },
    						darkLightControls: { darkSat: 40, lightSat: 20, darkBright: -40, lightBright: 20 }
    					},
    					triadic: {
    						triadicBalanceMode: 'equal',
    						triadicVibrance: 'equal',
    						darkLightPrefs: { dark: 'recommended', light: 'recommended' },
    						darkLightControls: { darkSat: 50, lightSat: 15, darkBright: -35, lightBright: 25 }
    					},
    					tetradic: {
    						tetradicPairingMode: 'rectangle',
    						tetradicDominance: 50,
    						tetradicSaturationStrategy: 'all-equal',
    						darkLightPrefs: { dark: 'recommended', light: 'recommended' },
    						darkLightControls: { darkSat: 60, lightSat: 20, darkBright: -30, lightBright: 20 }
    					}
    				};
    				return defaults[paletteType];
    			}
    			function checkPaletteChanged(paletteType) {
    				const defaults = getPaletteDefaults(paletteType);
    				if (!defaults) return false;
    				let hasChanged = false;
    				const paletteIdMap = {
    					'monochromatic': 'monochromatic',
    					'dominant': 'dominant-with-accents',
    					'neutralpop': 'neutral-pop',
    					'analogous': 'analogous',
    					'complementary': 'complementary',
    					'warmcool': 'warm-cool-split',
    					'split': 'split-complementary',
    					'triadic': 'triadic',
    					'tetradic': 'tetradic'
    				};
    				const paletteId = paletteIdMap[paletteType];
    				if (paletteId && paletteBackgrounds[paletteId]) {
    					hasChanged = true;
    				}
    				if (paletteId && lockedPalettes[paletteId]) {
    					hasChanged = true;
    				}
    				switch(paletteType) {
    					case 'monochromatic':
    						hasChanged = hasChanged || monochromaticSpread !== defaults.monochromaticSpread ||
    									accentHueShift !== defaults.accentHueShift ||
    									accentBrightnessShift !== defaults.accentBrightnessShift ||
    									accentSaturationShift !== defaults.accentSaturationShift;
    						break;
    					case 'dominant':
    						hasChanged = hasChanged || accentIntensity !== defaults.accentIntensity ||
    									dominantRelationship !== defaults.dominantRelationship ||
    									dominantDistribution !== defaults.dominantDistribution;
    						break;
    					case 'neutralpop':
    						hasChanged = hasChanged || neutralSpread !== defaults.neutralSpread ||
    									neutralStrategy !== defaults.neutralStrategy ||
    									neutralDepth !== defaults.neutralDepth ||
    									neutralBrightnessShift !== defaults.neutralBrightnessShift;
    						break;
    					case 'analogous':
    						hasChanged = hasChanged || analogousRange !== defaults.analogousRange ||
    									analogousColorCount !== defaults.analogousColorCount ||
    									analogousDistribution !== defaults.analogousDistribution;
    						break;
    					case 'complementary':
    						hasChanged = hasChanged || complementaryBalance !== defaults.complementaryBalance ||
    									complementaryTension !== defaults.complementaryTension ||
    									complementaryBrightnessMode !== defaults.complementaryBrightnessMode;
    						break;
    					case 'warmcool':
    						hasChanged = hasChanged || warmCoolMode !== defaults.warmCoolMode ||
    									warmCoolContrast !== defaults.warmCoolContrast ||
    									temperatureShift !== defaults.temperatureShift;
    						break;
    					case 'split':
    						hasChanged = hasChanged || splitAngle !== defaults.splitAngle ||
    									splitEmphasis !== defaults.splitEmphasis ||
    									splitSatDistribution !== defaults.splitSatDistribution;
    						break;
    					case 'triadic':
    						hasChanged = hasChanged || triadicBalanceMode !== defaults.triadicBalanceMode ||
    									triadicVibrance !== defaults.triadicVibrance;
    						break;
    					case 'tetradic':
    						hasChanged = hasChanged || tetradicPairingMode !== defaults.tetradicPairingMode ||
    									tetradicDominance !== defaults.tetradicDominance ||
    									tetradicSaturationStrategy !== defaults.tetradicSaturationStrategy;
    						break;
    				}
    				if (!hasChanged) {
    					hasChanged = darkLightPreferences[paletteType].dark !== defaults.darkLightPrefs.dark ||
    								darkLightPreferences[paletteType].light !== defaults.darkLightPrefs.light;
    				}
    				if (!hasChanged) {
    					const dlControls = darkLightAdvancedControls[paletteType];
    					const dlDefaults = defaults.darkLightControls;
    					hasChanged = dlControls.darkSat !== dlDefaults.darkSat ||
    								dlControls.lightSat !== dlDefaults.lightSat ||
    								dlControls.darkBright !== dlDefaults.darkBright ||
    								dlControls.lightBright !== dlDefaults.lightBright;
    				}
    				return hasChanged;
    			}
    			function updatePaletteResetButtons() {
    				document.querySelectorAll('.cg-palette-section').forEach(section => {
    					const paletteId = section.dataset.paletteId;
    					const paletteTypeMap = {
    						'monochromatic': 'monochromatic',
    						'dominant-with-accents': 'dominant',
    						'neutral-pop': 'neutralpop',
    						'analogous': 'analogous',
    						'complementary': 'complementary',
    						'warm-cool-split': 'warmcool',
    						'split-complementary': 'split',
    						'triadic': 'triadic',
    						'tetradic': 'tetradic'
    					};
    					const paletteType = paletteTypeMap[paletteId];
    					if (!paletteType) return;
    					const hasChanged = checkPaletteChanged(paletteType);
    					const resetButton = section.querySelector('.reset-button');
    					if (resetButton) {
    						resetButton.disabled = !hasChanged;
    						if (!hasChanged) {
    							resetButton.style.opacity = '0.6';
    							resetButton.style.cursor = 'default';
    						} else {
    							resetButton.style.opacity = '1';
    							resetButton.style.cursor = 'pointer';
    						}
    					}
    				});
    			}
    			function updateHueSliderGradient() {
    				const hueSlider = document.getElementById('hueSlider');
    				const rybGradientStops = [];
    				for (let i = 0; i <= 12; i++) {
    					const rybHue = (i / 12) * 360;
    					const rgbHue = rybToRgbHue(rybHue);
    					const color = hslToHex(rgbHue, 100, 50);
    					const position = (i / 12) * 100;
    					rybGradientStops.push(color + ' ' + position + '%');
    				}
    				const rybGradient = 'linear-gradient(to right, ' + rybGradientStops.join(', ') + ')';
    				hueSlider.style.background = rybGradient;
    			}
    			function getRecommendedChoices(paletteType) {
    				const recommendations = {
    					monochromatic: { dark: 'base', light: 'base' },
    					dominant: { dark: 'dominant', light: 'accent' },
    					neutralpop: { dark: 'neutral', light: 'pop' },
    					analogous: { dark: 'base', light: 'base' },
    					complementary: { dark: 'primary', light: 'complement' },
    					warmcool: { dark: 'warm_base', light: 'cool_main' },
    					split: { dark: 'primary', light: 'split1' },
    					triadic: { dark: 'primary', light: 'triadic1' },
    					tetradic: { dark: 'primary', light: 'complement' }
    				};
    				return recommendations[paletteType] || { dark: 'base', light: 'base' };
    			}
    			function getDarkLightHue(paletteType, colorType) {
    				const preference = darkLightPreferences[paletteType][colorType];
    				if (preference === 'recommended') {
    					const recommended = getRecommendedChoices(paletteType);
    					return getHueFromColorChoice(recommended[colorType]);
    				}
    				return getHueFromColorChoice(preference);
    			}
    			function getAnalogousHueFromChoice(choice) {
    				const theoryHue = selectedHue;
    				const index = parseInt(choice.replace('analogous', ''), 10);
    				const range = analogousRange / 2;
    				const count = analogousColorCount;
    				const numColorsAfterBase = count - 1;
    				const direction = invertDirection ? -1 : 1;
    				let offset = 0;
    				if (index > numColorsAfterBase) return theoryHue;
    				const i = index;
    				switch (analogousDistribution) {
    					case 'gradual':
    						offset = range * Math.pow(i / numColorsAfterBase, GRADUAL_DISTRIBUTION_POWER);
    						break;
    					case 'clustered':
    						offset = range * Math.pow(i / numColorsAfterBase, CLUSTERED_DISTRIBUTION_POWER);
    						break;
    					case 'even':
    					default:
    						offset = range * (i / numColorsAfterBase);
    						break;
    				}
    				return (theoryHue + offset * direction + 360) % 360;
    			}
    			function getTemperatureShift() {
    				let baseShift;
    				if (warmCoolMode === '1:3') {
    					switch(warmCoolContrast) {
    						case 'subtle': baseShift = 150; break;
    						case 'strong': baseShift = 210; break;
    						case 'moderate': default: baseShift = 180; break;
    					}
    				} else { // 2:2 mode
    					switch(warmCoolContrast) {
    						case 'subtle': baseShift = 40; break;
    						case 'strong': baseShift = 90; break;
    						case 'moderate': default: baseShift = 60; break;
    					}
    				}
    				return baseShift + temperatureShift;
    			}
    			function getHueFromColorChoice(choice) {
    				const theoryHue = selectedHue;
    				switch (choice) {
    					case 'base':
    					case 'primary':
    						return theoryHue;
    					case 'dominant':
    						return theoryHue;
    					case 'secondary':
    						switch(dominantRelationship) {
    							case '30°': return (theoryHue + 30) % 360;
    							case '120°': return (theoryHue + 120) % 360;
    							case '180°': return getRybComplement(theoryHue);
    							case '15°': return (theoryHue + 15) % 360;
    						}
    					case 'accent':
    						switch(dominantRelationship) {
    							case '30°': return getRybComplement(theoryHue);
    							case '120°': return (theoryHue + 150) % 360;
    							case '180°': return (theoryHue + 120) % 360;
    							case '15°': return (theoryHue + 45) % 360;
    						}
    					case 'analogous1':
    					case 'analogous2':
    					case 'analogous3':
    						return getAnalogousHueFromChoice(choice);
    					case 'complement':
    						return (getRybComplement(theoryHue) + complementaryTension) % 360;
    					case 'warm_base':
    						if (warmCoolMode === '2:2') {
    							const baseTemp = getColorTemperature(theoryHue);
    							return baseTemp === 'warm' ? theoryHue : getRybComplement(theoryHue);
    						}
    						return theoryHue;
    					case 'cool_base':
    						if (warmCoolMode === '2:2') {
    							const baseTemp = getColorTemperature(theoryHue);
    							return baseTemp === 'cool' ? theoryHue : getRybComplement(theoryHue);
    						}
    						return theoryHue;
    					case 'warm_main':
    					case 'cool_main':
    						return getRybComplement(theoryHue);
    					case 'warm_alt1':
    						const tempShiftW1 = getTemperatureShift();
    						if (warmCoolMode === '2:2') {
    							const baseTemp = getColorTemperature(theoryHue);
    							if (baseTemp === 'warm') {
    								return (theoryHue + tempShiftW1) % 360;
    							} else {
    								return ((getRybComplement(theoryHue) + tempShiftW1) % 360);
    							}
    						} else {
    							return (theoryHue + (tempShiftW1 - 20)) % 360;
    						}
    					case 'cool_alt1':
    						const tempShiftC1 = getTemperatureShift();
    						if (warmCoolMode === '2:2') {
    							const baseTemp = getColorTemperature(theoryHue);
    							if (baseTemp === 'cool') {
    								return (theoryHue + tempShiftC1) % 360;
    							} else {
    								return ((getRybComplement(theoryHue) + tempShiftC1) % 360);
    							}
    						} else {
    							return (theoryHue + (tempShiftC1 - 20)) % 360;
    						}
    					case 'warm_alt2':
    					case 'cool_alt2':
    						const tempShift2 = getTemperatureShift();
    						return (theoryHue + (tempShift2 + 20)) % 360;
    					case 'split1':
    						const complementS1 = getRybComplement(theoryHue);
    						return (complementS1 - splitAngle + 360) % 360;
    					case 'split2':
    						const complementS2 = getRybComplement(theoryHue);
    						return (complementS2 + splitAngle) % 360;
    					case 'triadic1': {
    						const directionT1 = invertDirection ? -1 : 1;
    						switch(triadicBalanceMode) {
    							case 'major': return (theoryHue + 100 * directionT1 + 360) % 360;
    							case 'minor': return (theoryHue + 90 * directionT1 + 360) % 360;
    							case 'golden': return (theoryHue + 137.5 * directionT1 + 360) % 360;
    							case 'equal': default: return (theoryHue + 120 * directionT1 + 360) % 360;
    						}
    					}
    					case 'triadic2': {
    						const directionT2 = invertDirection ? -1 : 1;
    						switch(triadicBalanceMode) {
    							case 'major': return (theoryHue + 240 * directionT2 + 360) % 360;
    							case 'minor': return (theoryHue + 180 * directionT2 + 360) % 360;
    							case 'golden': return (theoryHue + 275 * directionT2 + 360) % 360;
    							case 'equal': default: return (theoryHue + 240 * directionT2 + 360) % 360;
    						}
    					}
    					case 'color2':
    					case 'color4':
    						return theoryHue;
    					default:
    						return theoryHue;
    				}
    			}
    			function getColorTemperature(hue) {
    				const rgbHue = rybToRgbHue(hue);
    				if (rgbHue <= 90 || rgbHue >= 270) return 'warm';
    				return 'cool';
    			}
    			function createDarkLightBottomRow(paletteType) {
    				const darkHue = getDarkLightHue(paletteType, 'dark');
    				const lightHue = getDarkLightHue(paletteType, 'light');
    				const controls = darkLightAdvancedControls[paletteType];
    				const darkSat = Math.min(100, baseSaturation * (controls.darkSat / 100) * 1.2);
    				const darkBright = baseBrightness + controls.darkBright;
    				const lightSat = Math.min(100, baseSaturation * (controls.lightSat / 100) * 0.8);
    				const lightBright = baseBrightness + controls.lightBright;
    				return [
    					{ hex: createTheoryColor(darkHue, darkSat, darkBright), label: 'dark', id: 'dark' },
    					{ hex: createTheoryColor(lightHue, lightSat, lightBright), label: 'light', id: 'light' }
    				];
    			}
    			function generateMonochromatic() {
    				const theoryHue = selectedHue;
    				const complementHue = getRybComplement(theoryHue);
    				const spread = monochromaticSpread;
    				const progress = (spread - 15) / 45;
    				const lerp = (a, b, t) => a + t * (b - a);
    				const darkerBrightnessAdj = lerp(-10, -50, progress);
    				const darkerSaturationAdj = lerp(-5, -30, progress);
    				const lighterBrightnessAdj = lerp(10, 40, progress);
    				const lighterSaturationAdj = lerp(-5, -20, progress);
    				const accentBaseSaturation = baseSaturation * ACCENT_SATURATION_BOOST;
    				const accentBaseBrightness = baseBrightness - 5;
    				const finalAccentSaturation = accentBaseSaturation + accentSaturationShift;
    				const finalAccentBrightness = accentBaseBrightness + accentBrightnessShift;
    				const topRow = [
    					{ 
    						hex: createTheoryColor(
    							theoryHue, 
    							Math.max(0, Math.min(100, baseSaturation + darkerSaturationAdj)), 
    							Math.max(0, Math.min(100, baseBrightness + darkerBrightnessAdj))
    						), 
    						label: 'darker', 
    						id: 'darker' 
    					},
    					{ 
    						hex: createTheoryColor(theoryHue, baseSaturation, baseBrightness), 
    						label: 'base', 
    						id: 'base' 
    					},
    					{ 
    						hex: createTheoryColor(
    							theoryHue, 
    							Math.max(0, Math.min(100, baseSaturation + lighterSaturationAdj)), 
    							Math.max(0, Math.min(100, baseBrightness + lighterBrightnessAdj))
    						), 
    						label: 'lighter', 
    						id: 'lighter' 
    					},
    					{ 
    						hex: createTheoryColor(
    							(complementHue + accentHueShift + 360) % 360, 
    							finalAccentSaturation, 
    							finalAccentBrightness
    						), 
    						label: 'accent', 
    						id: 'accent' 
    					}
    				];
    				return { topRow, bottomRow: createDarkLightBottomRow('monochromatic') };
    			}
    			function generateDominantAccent() {
    				const theoryHue = selectedHue;
    				let secondaryHue, accentHue;
    				switch(dominantRelationship) {
    					case '30°': secondaryHue = (theoryHue + 30) % 360; accentHue = getRybComplement(theoryHue); break;
    					case '120°': secondaryHue = (theoryHue + 120) % 360; accentHue = (theoryHue + 150) % 360; break;
    					case '180°': secondaryHue = getRybComplement(theoryHue); accentHue = (theoryHue + 120) % 360; break;
    					case '15°': secondaryHue = (theoryHue + 15) % 360; accentHue = (theoryHue + 45) % 360; break;
    					default: secondaryHue = (theoryHue + 30) % 360; accentHue = getRybComplement(theoryHue); break;
    				}
    				let domSat, domBright, secSat, secBright, accSat, accBright;
    				const dist = dominantDistribution;
    				const intensityFactor = (accentIntensity / 100) * 1.5;
    				const lerp = (a, b, t) => a + t * (b - a);
    				const normalizedBrightness = baseBrightness / 100; // 0 to 1
    				const accentBrightnessOffset = (25 - 50 * normalizedBrightness) * intensityFactor;
    				const kf40 = {
    					domSat: baseSaturation * 0.8, 
    					domBright: baseBrightness,
    					secSat: baseSaturation, 
    					secBright: Math.min(100, baseBrightness + 10),
    					accSat: Math.min(100, baseSaturation + 25 * intensityFactor),
    					accBright: Math.max(0, Math.min(100, baseBrightness + accentBrightnessOffset))
    				};
    				const kf55 = {
    					domSat: baseSaturation, 
    					domBright: baseBrightness,
    					secSat: baseSaturation * SECONDARY_SATURATION_RATIO, 
    					secBright: baseBrightness,
    					accSat: Math.min(100, baseSaturation + (20 * intensityFactor)),
    					accBright: Math.max(0, Math.min(100, baseBrightness + accentBrightnessOffset * 0.75))
    				};
    				const kf70 = {
    					domSat: baseSaturation, 
    					domBright: baseBrightness,
    					secSat: baseSaturation * 0.7, 
    					secBright: Math.max(0, baseBrightness - 15),
    					accSat: Math.min(100, kf55.accSat + 15 * intensityFactor),
    					accBright: Math.max(0, Math.min(100, baseBrightness + accentBrightnessOffset * 0.5))
    				};
    				if (dist <= 40) {
    					 ({ domSat, domBright, secSat, secBright, accSat, accBright } = kf40);
    				} else if (dist < 55) {
    					const t = (dist - 40) / 15;
    					domSat = lerp(kf40.domSat, kf55.domSat, t);
    					domBright = lerp(kf40.domBright, kf55.domBright, t);
    					secSat = lerp(kf40.secSat, kf55.secSat, t);
    					secBright = lerp(kf40.secBright, kf55.secBright, t);
    					accSat = lerp(kf40.accSat, kf55.accSat, t);
    					accBright = lerp(kf40.accBright, kf55.accBright, t);
    				} else { // dist >= 55
    					const t = (dist - 55) / 15;
    					domSat = lerp(kf55.domSat, kf70.domSat, t);
    					domBright = lerp(kf55.domBright, kf70.domBright, t);
    					secSat = lerp(kf55.secSat, kf70.secSat, t);
    					secBright = lerp(kf55.secBright, kf70.secBright, t);
    					accSat = lerp(kf55.accSat, kf70.accSat, t);
    					accBright = lerp(kf55.accBright, kf70.accBright, t);
    				}
    				domSat = Math.max(0, Math.min(100, domSat));
    				secSat = Math.max(0, Math.min(100, secSat));
    				accSat = Math.max(0, Math.min(100, accSat));
    				domBright = Math.max(0, Math.min(100, domBright));
    				secBright = Math.max(0, Math.min(100, secBright));
    				accBright = Math.max(0, Math.min(100, accBright));
    				const topRow = [
    					{ hex: createTheoryColor(theoryHue, domSat, domBright), label: 'dominant', id: 'dominant' },
    					{ hex: createTheoryColor(secondaryHue, secSat, secBright), label: 'secondary', id: 'secondary' },
    					{ hex: createTheoryColor(accentHue, accSat, accBright), label: 'accent', id: 'accent' }
    				];
    				return { topRow, bottomRow: createDarkLightBottomRow('dominant') };
    			}
    			function generateNeutralPop() {
    				let popBrightness = baseBrightness;
    				if (neutralPopIntensity > 100) {
    					if (baseBrightness > 60) popBrightness -= 5;
    					if (baseBrightness < 40) popBrightness += 5;
    				}
    				const popSaturation = Math.min(100, baseSaturation * (neutralPopIntensity / 100));
    				const popHue = selectedHue;
    				let neutralBaseHue;
    				switch(neutralStrategy) {
    					case 'true': neutralBaseHue = 0; break;
    					case 'tinted': neutralBaseHue = popHue; break;
    					case 'complement': neutralBaseHue = getRybComplement(popHue); break;
    					case 'offset': neutralBaseHue = (popHue + 30) % 360; break;
    				}
    				const coolHue = neutralStrategy === 'true' ? 210 : (neutralBaseHue - 15 + 360) % 360;
    				const warmHue = neutralStrategy === 'true' ? 30 : (neutralBaseHue + 15) % 360;
    				const spreadFactor = neutralSpread / 50; // 0 to 1
    				const neutralBrightness = baseBrightness + neutralBrightnessShift;
    				const maxBrightnessSpread = 25;
    				const maxSaturationSpread = 0.3; // 30% variation
    				const coolBrightness = Math.max(0, Math.min(100, 
    					neutralBrightness - (maxBrightnessSpread * spreadFactor)
    				));
    				const warmBrightness = Math.max(0, Math.min(100, 
    					neutralBrightness + (maxBrightnessSpread * spreadFactor)
    				));
    				const coolSaturation = Math.max(0, neutralDepth * (1 - maxSaturationSpread * spreadFactor));
    				const warmSaturation = Math.min(30, neutralDepth * (1 + maxSaturationSpread * spreadFactor));
    				const topRow = [
    					{ hex: createTheoryColor(popHue, popSaturation, popBrightness), label: 'pop', id: 'pop' },
    					{ hex: createTheoryColor(neutralBaseHue, neutralDepth, neutralBrightness), label: 'neutral', id: 'neutral' },
    					{ hex: createTheoryColor(coolHue, coolSaturation, coolBrightness), label: 'cool', id: 'cool' },
    					{ hex: createTheoryColor(warmHue, warmSaturation, warmBrightness), label: 'warm', id: 'warm' }
    				];
    				const bottomRow = createDarkLightBottomRow('neutralpop');
    				return { topRow, bottomRow };
    			}
    			function generateAnalogous() {
    				const theoryHue = selectedHue;
    				const range = analogousRange / 2;
    				const count = analogousColorCount;
    				const direction = invertDirection ? -1 : 1;
    				const lerp = (a, b, t) => a + t * (b - a);
    				let hueOffsets = [];
    				const numColorsAfterBase = count - 1;
    				if (numColorsAfterBase > 0) {
    					switch (analogousDistribution) {
    						case 'gradual':
    							for (let i = 1; i <= numColorsAfterBase; i++) {
    								const progress = i / numColorsAfterBase;
    								hueOffsets.push(range * Math.pow(progress, GRADUAL_DISTRIBUTION_POWER));
    							}
    							break;
    						case 'clustered':
    							for (let i = 1; i <= numColorsAfterBase; i++) {
    								const progress = i / numColorsAfterBase;
    								hueOffsets.push(range * Math.pow(progress, CLUSTERED_DISTRIBUTION_POWER));
    							}
    							break;
    						case 'even':
    						default:
    							for (let i = 1; i <= numColorsAfterBase; i++) {
    								hueOffsets.push(range * (i / numColorsAfterBase));
    							}
    							break;
    					}
    				}
    				let saturations = [baseSaturation];
    				if (numColorsAfterBase > 0) {
    					for (let i = 1; i <= numColorsAfterBase; i++) {
    						const progress = i / numColorsAfterBase;
    						saturations.push(baseSaturation - (15 * progress));
    					}
    				}
    				const topRow = [{
    					hex: createTheoryColor(theoryHue, saturations[0], baseBrightness),
    					label: 'base',
    					id: 'base'
    				}];
    				for (let i = 0; i < hueOffsets.length; i++) {
    					const hue = (theoryHue + hueOffsets[i] * direction + 360) % 360;
    					const saturation = Math.max(0, Math.min(100, saturations[i + 1]));
    					const brightness = baseBrightness;
    					const colorId = `analogous${i + 1}`;
    					topRow.push({
    						hex: createTheoryColor(hue, saturation, brightness),
    						label: `${direction > 0 ? '+' : '-'}${Math.round(hueOffsets[i])}°`,
    						id: colorId
    					});
    				}
    				return { topRow, bottomRow: createDarkLightBottomRow('analogous') };
    			}
    			function generateComplementary() {
    				const theoryHue = selectedHue;
    				const complementHue = (getRybComplement(theoryHue) + complementaryTension) % 360;
    				const primaryWeight = complementaryBalance / 100;
    				const complementWeight = 1 - primaryWeight;
    				const primarySat = baseSaturation;
    				const complementSat = baseSaturation * (0.45 + 0.55 * Math.pow(complementWeight, 0.8));
    				const primaryBright = baseBrightness;
    				const distanceFromCenter = Math.abs(primaryWeight - 0.5) * 2; // 0 to 1
    				const baseAdjustment = 10 + (20 * distanceFromCenter);
    				let complementBright;
    				const brightnessDirection = (complementaryBrightnessMode === 'dark') ? -1 : 1;
    				if (primaryWeight > 0.5) {
    					complementBright = baseBrightness + (baseAdjustment * brightnessDirection);
    				} else {
    					if (baseBrightness > 50) {
    						complementBright = baseBrightness - (baseAdjustment * 0.3);
    					} else {
    						complementBright = baseBrightness + (baseAdjustment * 0.3);
    					}
    				}
    				complementBright = Math.max(15, Math.min(90, complementBright));
    				const primaryVarBright = Math.max(20, primaryBright - 20);
    				const complementVarBright = Math.max(20, complementBright - 20);
    				const topRow = [
    					{ hex: createTheoryColor(theoryHue, primarySat, primaryBright), label: 'primary', id: 'primary' },
    					{ hex: createTheoryColor(theoryHue, primarySat * 0.7, primaryVarBright), label: 'primary var', id: 'primary_adj' },
    					{ hex: createTheoryColor(complementHue, complementSat, complementBright), label: 'comp', id: 'complement' },
    					{ hex: createTheoryColor(complementHue, complementSat * 0.7, complementVarBright), label: 'comp var', id: 'complement_adj' }
    				];
    				return { topRow, bottomRow: createDarkLightBottomRow('complementary') };
    			}
    			function generateWarmCoolSplit() {
    				const theoryHue = selectedHue;
    				const baseTemperature = getColorTemperature(theoryHue);
    				const tempShift = getTemperatureShift();
    				let topRow;
    				if (warmCoolMode === '1:3') {
    					const primaryShift = tempShift;
    					const variation1 = tempShift - 20;
    					const variation2 = tempShift + 20;
    					if (baseTemperature === 'warm') {
    						topRow = [
    							{ hex: createTheoryColor(theoryHue, baseSaturation, baseBrightness), label: 'warm base', id: 'warm_base' },
    							{ hex: createTheoryColor((theoryHue + variation1) % 360, baseSaturation * 0.8, baseBrightness), label: 'cool alt 1', id: 'cool_alt1' },
    							{ hex: createTheoryColor((theoryHue + primaryShift) % 360, baseSaturation * 0.9, baseBrightness), label: 'cool main', id: 'cool_main' },
    							{ hex: createTheoryColor((theoryHue + variation2) % 360, baseSaturation * 0.8, baseBrightness), label: 'cool alt 2', id: 'cool_alt2' }
    						];
    					} else {
    						topRow = [
    							{ hex: createTheoryColor(theoryHue, baseSaturation, baseBrightness), label: 'cool base', id: 'cool_base' },
    							{ hex: createTheoryColor((theoryHue + variation1) % 360, baseSaturation * 0.8, baseBrightness), label: 'warm alt 1', id: 'warm_alt1' },
    							{ hex: createTheoryColor((theoryHue + primaryShift) % 360, baseSaturation * 0.9, baseBrightness), label: 'warm main', id: 'warm_main' },
    							{ hex: createTheoryColor((theoryHue + variation2) % 360, baseSaturation * 0.8, baseBrightness), label: 'warm alt 2', id: 'warm_alt2' }
    						];
    					}
    				} else { // 2:2 Mode
    					const complement = getRybComplement(theoryHue);
    					const baseAlt = (theoryHue + tempShift) % 360;
    					const complementAlt = (complement + tempShift) % 360;
    					if (baseTemperature === 'warm') {
    						topRow = [
    							{ hex: createTheoryColor(theoryHue, baseSaturation, baseBrightness), label: 'warm base', id: 'warm_base' },
    							{ hex: createTheoryColor(baseAlt, baseSaturation * 0.9, baseBrightness), label: 'warm alt', id: 'warm_alt1' },
    							{ hex: createTheoryColor(complement, baseSaturation * 0.9, baseBrightness), label: 'cool base', id: 'cool_base' },
    							{ hex: createTheoryColor(complementAlt, baseSaturation * 0.8, baseBrightness), label: 'cool alt', id: 'cool_alt1' }
    						];
    					} else {
    						topRow = [
    							{ hex: createTheoryColor(theoryHue, baseSaturation, baseBrightness), label: 'cool base', id: 'cool_base' },
    							{ hex: createTheoryColor(baseAlt, baseSaturation * 0.9, baseBrightness), label: 'cool alt', id: 'cool_alt1' },
    							{ hex: createTheoryColor(complement, baseSaturation * 0.9, baseBrightness), label: 'warm base', id: 'warm_base' },
    							{ hex: createTheoryColor(complementAlt, baseSaturation * 0.8, baseBrightness), label: 'warm alt', id: 'warm_alt1' }
    						];
    					}
    				}
    				return { topRow, bottomRow: createDarkLightBottomRow('warmcool') };
    			}
    			function generateSplitComplementary() {
    				const theoryHue = selectedHue;
    				const complementHue = getRybComplement(theoryHue);
    				const split1Hue = (complementHue - splitAngle + 360) % 360;
    				const split2Hue = (complementHue + splitAngle) % 360;
    				let primarySat, primaryBright, split1Sat, split1Bright, split2Sat, split2Bright;
    				const brightnessAdjust = BRIGHTNESS_RANGE * 0.5;
    				switch (splitEmphasis) {
    					case 'primary-focused':
    						primarySat = baseSaturation;
    						primaryBright = baseBrightness;
    						split1Sat = baseSaturation * 0.65;
    						split2Sat = baseSaturation * 0.65;
    						split1Bright = baseBrightness + brightnessAdjust;
    						split2Bright = baseBrightness - brightnessAdjust;
    						break;
    					case 'split-focused':
    						primarySat = baseSaturation * 0.6;
    						primaryBright = baseBrightness - 10;
    						split1Sat = baseSaturation;
    						split2Sat = baseSaturation;
    						split1Bright = baseBrightness;
    						split2Bright = baseBrightness;
    						break;
    					case 'balanced':
    					default:
    						primarySat = baseSaturation * 0.9;
    						primaryBright = baseBrightness;
    						split1Sat = baseSaturation * 0.9;
    						split2Sat = baseSaturation * 0.9;
    						split1Bright = baseBrightness;
    						split2Bright = baseBrightness;
    						break;
    				}
    				switch (splitSatDistribution) {
    					case 'cascade':
    						split1Sat *= 0.8;
    						split2Sat *= 0.6;
    						break;
    					case 'diverge':
    						split2Sat *= 0.5;
    						break;
    					case 'primary-focus':
    						split1Sat *= 0.6;
    						split2Sat *= 0.6;
    						break;
    					case 'equal':
    					default:
    						break;
    				}
    				const topRow = [
    					{ hex: createTheoryColor(theoryHue, primarySat, primaryBright), label: 'primary', id: 'primary' },
    					{ hex: createTheoryColor(split1Hue, split1Sat, split1Bright), label: 'split1', id: 'split1' },
    					{ hex: createTheoryColor(split2Hue, split2Sat, split2Bright), label: 'split2', id: 'split2' }
    				];
    				return { topRow, bottomRow: createDarkLightBottomRow('split') };
    			}
    			function generateTriadic() {
    				const theoryHue = selectedHue;
    				const direction = invertDirection ? -1 : 1;
    				let triadic1Hue, triadic2Hue;
    				switch(triadicBalanceMode) {
    					case 'major':
    						triadic1Hue = (theoryHue + 100 * direction + 360) % 360;
    						triadic2Hue = (theoryHue + 240 * direction + 360) % 360;
    						break;
    					case 'minor':
    						triadic1Hue = (theoryHue + 90 * direction + 360) % 360;
    						triadic2Hue = (theoryHue + 180 * direction + 360) % 360;
    						break;
    					case 'golden':
    						triadic1Hue = (theoryHue + 137.5 * direction + 360) % 360;
    						triadic2Hue = (theoryHue + 275 * direction + 360) % 360;
    						break;
    					case 'equal':
    					default:
    						triadic1Hue = (theoryHue + 120 * direction + 360) % 360;
    						triadic2Hue = (theoryHue + 240 * direction + 360) % 360;
    						break;
    				}
    				let primarySat, triadic1Sat, triadic2Sat;
    				switch(triadicVibrance) {
    					case 'full':
    						primarySat = baseSaturation;
    						triadic1Sat = baseSaturation;
    						triadic2Sat = baseSaturation;
    						break;
    					case 'cascade':
    						primarySat = baseSaturation;
    						triadic1Sat = baseSaturation * 0.6;
    						triadic2Sat = baseSaturation * 0.3;
    						break;
    					case 'primary-muted':
    						primarySat = baseSaturation;
    						triadic1Sat = baseSaturation * 0.3;
    						triadic2Sat = baseSaturation * 0.3;
    						break;
    					case 'duotone-accent':
    						primarySat = baseSaturation * 0.9;
    						triadic1Sat = baseSaturation * 0.9;
    						triadic2Sat = baseSaturation * 0.3;
    						break;
    					case 'equal': 
    					default:
    						primarySat = baseSaturation * 0.8;
    						triadic1Sat = baseSaturation * 0.8;
    						triadic2Sat = baseSaturation * 0.8;
    						break;
    				}
    				const topRow = [
    					{ hex: createTheoryColor(theoryHue, primarySat, baseBrightness), label: 'primary', id: 'primary' },
    					{ hex: createTheoryColor(triadic1Hue, triadic1Sat, baseBrightness), label: 'triadic1', id: 'triadic1' },
    					{ hex: createTheoryColor(triadic2Hue, triadic2Sat, baseBrightness), label: 'triadic2', id: 'triadic2' }
    				];
    				return { topRow, bottomRow: createDarkLightBottomRow('triadic') };
    			}
    			function generateTetradic() {
    				const theoryHue = selectedHue;
    				const direction = invertDirection ? -1 : 1;
    				let hues = [];
    				let labels = [];
    				const complementHue = getRybComplement(theoryHue);
    				switch (tetradicPairingMode) {
    					case 'square':
    						hues = [theoryHue, (theoryHue + 90) % 360, complementHue, (complementHue + 90) % 360];
    						labels = ['Base', '+90°', 'Comp', 'Comp+90°'];
    						break;
    					case 'double-split':
    						hues = [theoryHue, (theoryHue + 30) % 360, complementHue, (complementHue + 30) % 360];
    						labels = ['Base', '+30°', 'Comp', 'Comp+30°'];
    						break;
    					case 'rectangle':
    					default:
    						hues = [theoryHue, (theoryHue + 60 * direction + 360) % 360, complementHue, (complementHue + 60 * direction + 360) % 360];
    						labels = ['Base', `+${60*direction}°`, 'Comp', `Comp+${60*direction}°`];
    						break;
    				}
    				let baseSaturations = [];
    				switch (tetradicSaturationStrategy) {
    					case 'alternating':
    						baseSaturations = [baseSaturation, baseSaturation * 0.7, baseSaturation, baseSaturation * 0.7];
    						break;
    					case 'gradual':
    						baseSaturations = [baseSaturation, baseSaturation * 0.85, baseSaturation * 0.7, baseSaturation * 0.55];
    						break;
    					case 'primary-focus':
    						baseSaturations = [baseSaturation, baseSaturation * 0.6, baseSaturation * 0.6, baseSaturation * 0.6];
    						break;
    					case 'all-equal':
    					default:
    						baseSaturations = [baseSaturation, baseSaturation, baseSaturation, baseSaturation];
    						break;
    				}
    				const dominanceFactor = tetradicDominance / 100;
    				const lerp = (a, b, t) => a * (1 - t) + b * t;
    				let satMultiplier;
    				if (dominanceFactor <= 0.5) {
    					satMultiplier = lerp(1.0, 0.85, dominanceFactor / 0.5);
    				} else {
    					satMultiplier = lerp(0.85, 0.5, (dominanceFactor - 0.5) / 0.5);
    				}
    				const finalSaturations = [...baseSaturations];
    				finalSaturations[2] *= satMultiplier;
    				finalSaturations[3] *= satMultiplier;
    				const brightnessAdjust = (BRIGHTNESS_RANGE * BRIGHTNESS_VARIATION_FACTOR) * dominanceFactor;
    				const brightnesses = [baseBrightness, baseBrightness, baseBrightness, baseBrightness];
    				const secondaryBrightness = baseBrightness > 50 ? baseBrightness - brightnessAdjust : baseBrightness + brightnessAdjust;
    				brightnesses[2] = secondaryBrightness;
    				brightnesses[3] = secondaryBrightness;
    				const topRow = hues.map((hue, i) => ({
    					hex: createTheoryColor(hue, finalSaturations[i], brightnesses[i]),
    					label: labels[i],
    					id: i === 0 ? 'primary' : i === 2 ? 'complement' : `color${i+1}`
    				}));
    				return { topRow, bottomRow: createDarkLightBottomRow('tetradic') };
    			}
    			function getPaletteGenerator(paletteType) {
    				const generators = {
    					'monochromatic': generateMonochromatic,
    					'dominant': generateDominantAccent,
    					'neutralpop': generateNeutralPop,
    					'analogous': generateAnalogous,
    					'complementary': generateComplementary,
    					'warmcool': generateWarmCoolSplit,
    					'split': generateSplitComplementary,
    					'triadic': generateTriadic,
    					'tetradic': generateTetradic
    				};
    				return generators[paletteType];
    			}
    			function createLockIcon(isLocked) {
    				return `
    					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none">
    						<rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/>
    						<path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" fill="none"/>
    						<circle cx="12" cy="15" r="1" fill="white"/>
    						<path d="M12 16v2" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    					</svg>
    				`;
    			}
    			function handleLockClick(paletteSection) {
    				const paletteId = paletteSection.dataset.paletteId;
    				const isLocked = paletteSection.classList.contains('locked');
    				if (isLocked) {
    					delete lockedPalettes[paletteId];
    					paletteSection.classList.remove('locked');
    					updateSinglePalette(paletteSection);
    				} else {
    					lockedPalettes[paletteId] = {
    						hue: selectedHue,
    						saturation: baseSaturation,
    						brightness: baseBrightness
    					};
    					paletteSection.classList.add('locked');
    				}
    				const lockButton = paletteSection.querySelector('.cg-lock-button');
    				lockButton.innerHTML = createLockIcon(!isLocked);
    				saveState(); // Save the lock state
    				updatePaletteResetButtons();
    			}
    			function createDropdown(options, currentValue, onChange) {
    				const dropdown = document.createElement('select');
    				dropdown.className = 'cg-palette-dropdown';
    				options.forEach(({value, text}) => {
    					const option = document.createElement('option');
    					option.value = value;
    					option.textContent = text;
    					dropdown.appendChild(option);
    				});
    				dropdown.value = currentValue;
    				dropdown.addEventListener('change', onChange);
    				return dropdown;
    			}
    			function createColorSwatch(colorObj, paletteType, isBottomRow = false) {
    				const container = document.createElement('div');
    				container.className = 'cg-color-swatch-container';
    				const swatch = document.createElement('div');
    				swatch.className = 'cg-color-swatch';
    				swatch.style.backgroundColor = colorObj.hex;
    				const hsl = hexToHsl(colorObj.hex);
    				swatch.dataset.h = hsl.h;
    				swatch.dataset.s = hsl.s;
    				swatch.dataset.l = hsl.l;
    				swatch.dataset.id = colorObj.id;
    				const label = document.createElement('div');
    				label.className = 'cg-color-label';
    				label.textContent = colorObj.label;
    				swatch.appendChild(label);
    				if (isBottomRow && (colorObj.id === 'dark' || colorObj.id === 'light')) {
    					const dropdown = createDarkLightDropdown(paletteType, colorObj.id);
    					dropdown.className = 'cg-swatch-dropdown cg-swatch-dropdown-inside';
    					swatch.appendChild(dropdown);
    				}
    				container.appendChild(swatch);
    				return container;
    			}
    			function createDarkLightDropdown(paletteType, colorType) {
    				const dropdown = document.createElement('select');
    				dropdown.className = 'cg-swatch-dropdown';
    				dropdown.paletteType = paletteType;
    				dropdown.colorType = colorType;
    				populateDropdownOptions(dropdown, paletteType);
    				dropdown.value = darkLightPreferences[paletteType][colorType];
    				dropdown.addEventListener('change', (e) => {
    					darkLightPreferences[paletteType][colorType] = e.target.value;
    					updateColorsAndDisplays();
    					saveState();
    					checkForChanges(); // ADD THIS LINE
    				});
    				return dropdown;
    			}
    			function populateDropdownOptions(dropdown, paletteType) {
    				dropdown.innerHTML = '';
    				const recommendedOption = document.createElement('option');
    				recommendedOption.value = 'recommended';
    				recommendedOption.textContent = '✓ Recommended';
    				dropdown.appendChild(recommendedOption);
    				const getWarmCoolOptions = () => {
    					const baseTemperature = getColorTemperature(selectedHue);
    					if (warmCoolMode === '1:3') {
    						return baseTemperature === 'warm' ?
    							[{ value: 'warm_base', label: 'Warm Base' }, { value: 'cool_alt1', label: 'Cool Alt 1' }, { value: 'cool_main', label: 'Cool Main' }, { value: 'cool_alt2', label: 'Cool Alt 2' }] :
    							[{ value: 'cool_base', label: 'Cool Base' }, { value: 'warm_alt1', label: 'Warm Alt 1' }, { value: 'warm_main', label: 'Warm Main' }, { value: 'warm_alt2', label: 'Warm Alt 2' }];
    					} else {
    						return baseTemperature === 'warm' ?
    							[{ value: 'warm_base', label: 'Warm Base' }, { value: 'warm_alt1', label: 'Warm Alt' }, { value: 'cool_base', label: 'Cool Base' }, { value: 'cool_alt1', label: 'Cool Alt' }] :
    							[{ value: 'cool_base', label: 'Cool Base' }, { value: 'cool_alt1', label: 'Cool Alt' }, { value: 'warm_base', label: 'Warm Base' }, { value: 'warm_alt1', label: 'Warm Alt' }];
    					}
    				};
    				const optionSets = {
    					monochromatic: [{ value: 'base', label: 'Base' }, { value: 'accent', label: 'Accent' }],
    					dominant: [{ value: 'dominant', label: 'Dominant' }, { value: 'secondary', label: 'Secondary' }, { value: 'accent', label: 'Accent' }],
    					neutralpop: [{ value: 'pop', label: 'Pop' }, { value: 'neutral', label: 'Neutral' }, { value: 'cool', label: 'Cool' }, { value: 'warm', label: 'Warm' }],
    					analogous: (() => {
    						const options = [{ value: 'base', label: 'Base' }];
    						for (let i = 1; i < analogousColorCount; i++) {
    							options.push({ value: `analogous${i}`, label: `Analogous ${i}` });
    						}
    						return options;
    					})(),
    					complementary: [{ value: 'primary', label: 'Primary' }, { value: 'complement', label: 'Complement' }],
    					warmcool: getWarmCoolOptions(),
    					split: [{ value: 'primary', label: 'Primary' }, { value: 'split1', label: 'Split 1' }, { value: 'split2', label: 'Split 2' }],
    					triadic: [{ value: 'primary', label: 'Primary' }, { value: 'triadic1', label: 'Triadic 1' }, { value: 'triadic2', label: 'Triadic 2' }],
    					tetradic: [{ value: 'primary', label: 'Primary' }, { value: 'color2', label: 'Color 2' }, { value: 'complement', label: 'Complement' }, { value: 'color4', label: 'Color 4' }]
    				};
    				let options = optionSets[paletteType] || [];
    				options.forEach(option => {
    					const optionElement = document.createElement('option');
    					optionElement.value = option.value;
    					optionElement.textContent = option.label;
    					dropdown.appendChild(optionElement);
    				});
    			}
    			function updateAnalogousDropdowns() {
    				const analogousSection = document.querySelector('[data-palette-id="analogous"]');
    				if (analogousSection) {
    					const dropdowns = analogousSection.querySelectorAll('.cg-swatch-dropdown');
    					dropdowns.forEach(dropdown => {
    						const currentValue = dropdown.value;
    						populateDropdownOptions(dropdown, 'analogous');
    						const optionExists = Array.from(dropdown.options).some(option => option.value === currentValue);
    						if (optionExists) {
    							dropdown.value = currentValue;
    						} else {
    							dropdown.value = 'recommended';
    							darkLightPreferences.analogous[dropdown.colorType] = 'recommended';
    						}
    					});
    				}
    			}
    			function updateWarmCoolDropdowns() {
    				const warmCoolSection = document.querySelector('[data-palette-id="warm-cool-split"]');
    				if (warmCoolSection) {
    					const dropdowns = warmCoolSection.querySelectorAll('.cg-swatch-dropdown');
    					dropdowns.forEach(dropdown => {
    						const currentValue = dropdown.value;
    						populateDropdownOptions(dropdown, 'warmcool');
    						const optionExists = Array.from(dropdown.options).some(option => option.value === currentValue);
    						if (optionExists) {
    							dropdown.value = currentValue;
    						} else {
    							dropdown.value = 'recommended';
    							darkLightPreferences.warmcool[dropdown.colorType] = 'recommended';
    						}
    					});
    				}
    			}
    			function createCompactProportionBar(paletteType, colors) {
    				let proportionConfig;
    				const lerp = (a, b, t) => a + t * (b - a);
    				const proportionMap = {
    					monochromatic: { colors: ['base', 'lighter', 'darker'], percentages: [70, 20, 10] },
    					dominant: { colors: ['dominant', 'secondary', 'accent'], percentages: [60, 30, 10] },
    					neutralpop: { colors: ['neutral', 'warm', 'cool', 'pop'], percentages: [40, 25, 25, 10] },
    					analogous: { colors: colors.topRow.map(c => c.id), percentages: analogousColorCount === 3 ? [60, 30, 10] : [50, 30, 15, 5] },
    					complementary: { 
    						colors: ['primary', 'complement'], 
    						percentages: [complementaryBalance, 100 - complementaryBalance] 
    					},
    					warmcool: { colors: warmCoolMode === '1:3' ? (getColorTemperature(selectedHue) === 'warm' ? ['warm_base', 'cool_main', 'cool_alt1', 'cool_alt2'] : ['cool_base', 'warm_main', 'warm_alt1', 'warm_alt2']) : (getColorTemperature(selectedHue) === 'warm' ? ['warm_base', 'warm_alt1', 'cool_base', 'cool_alt1'] : ['cool_base', 'cool_alt1', 'warm_base', 'warm_alt1']), percentages: warmCoolMode === '1:3' ? [60, 25, 10, 5] : [40, 30, 20, 10] },
    					split: { colors: ['primary', 'split1', 'split2'], percentages: [70, 20, 10] },
    					triadic: { colors: ['primary', 'triadic1', 'triadic2'], percentages: [60, 30, 10] },
    					tetradic: { colors: ['primary', 'color2', 'complement', 'color4'], percentages: [40, 30, 20, 10] }
    				};
    				if (paletteType === 'dominant') {
    					const dist = dominantDistribution;
    					let percentages;
    					const equalRatios = [45, 35, 20];
    					const classicRatios = [60, 30, 10];
    					const heavyRatios = [70, 20, 10];
    					if (dist <= 40) {
    						percentages = equalRatios;
    					} else if (dist < 60) {
    						const t = (dist - 40) / 20;
    						percentages = [
    							lerp(equalRatios[0], classicRatios[0], t),
    							lerp(equalRatios[1], classicRatios[1], t),
    							lerp(equalRatios[2], classicRatios[2], t)
    						];
    					} else if (dist < 70) {
    						const t = (dist - 60) / 10;
    						percentages = [
    							lerp(classicRatios[0], heavyRatios[0], t),
    							lerp(classicRatios[1], heavyRatios[1], t),
    							lerp(classicRatios[2], heavyRatios[2], t)
    						];
    					} else {
    						percentages = heavyRatios;
    					}
    					const sum = percentages.reduce((a, b) => a + b, 0);
    					const normalizedPercentages = percentages.map(p => (p / sum) * 100);
    					proportionConfig = { 
    						colors: proportionMap.dominant.colors, 
    						percentages: normalizedPercentages
    					};
    				} else {
    					proportionConfig = proportionMap[paletteType];
    				}
    				if (!proportionConfig) return null;
    				const container = document.createElement('div');
    				container.className = 'cg-proportion-bar-container';
    				container.style.cssText = 'margin: 0px 0 0 0; position: relative;';
    				const bar = document.createElement('div');
    				bar.style.cssText = 'display: flex; height: 20px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); background: transparent; position: relative;';
    				const colorMap = {};
    				colors.topRow.forEach(c => { colorMap[c.id] = c.hex; });
    				proportionConfig.colors.forEach((colorId, index) => {
    					const percentage = proportionConfig.percentages[index];
    					const hex = colorMap[colorId];
    					if (hex && percentage > 0) {
    						const segment = document.createElement('div');
    						segment.style.cssText = `width: ${percentage}%; background: ${hex}; position: relative; transition: all 0.2s ease;`;
    						const label = document.createElement('span');
    						label.style.cssText = `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 11px; font-weight: 600; color: ${getContrastColor(hex)}; opacity: ${percentage < 10 ? 0 : 1}; transition: opacity 0.2s ease; pointer-events: none;`;
    						label.textContent = Math.round(percentage) + '%';
    						segment.appendChild(label);
    						bar.appendChild(segment);
    					}
    				});
    				container.appendChild(bar);
    				return container;
    			}
    			function getContrastColor(hexColor) {
    				if (!hexColor) return '#FFFFFF';
    				const r = parseInt(hexColor.slice(1, 3), 16);
    				const g = parseInt(hexColor.slice(3, 5), 16);
    				const b = parseInt(hexColor.slice(5, 7), 16);
    				const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    				return luminance > 0.5 ? '#2C3E50' : '#FFFFFF';
    			}
    			function setPaletteBackground(paletteSection, color, shouldSaveState = true) {
    				const paletteId = paletteSection.dataset.paletteId;
    				paletteBackgrounds[paletteId] = color;
    				paletteSection.classList.add('custom-bg');
    				paletteSection.style.background = color;
    				const textColor = getContrastColor(color);
    				const isDarkBg = textColor === '#FFFFFF';
    				paletteSection.style.setProperty('--dynamic-text-color', textColor);
    				if (isDarkBg) {
    					paletteSection.style.setProperty('--dynamic-icon-color', 'rgba(255, 255, 255, 0.7)');
    					paletteSection.style.setProperty('--dynamic-pinned-icon-color', '#82c7ff');
    					paletteSection.style.setProperty('--dynamic-locked-icon-color', '#ff8cc6');
    					paletteSection.style.setProperty('--dynamic-slider-thumb-color', '#FFFFFF');
    					paletteSection.style.setProperty('--dynamic-slider-track-color', 'rgba(255, 255, 255, 0.3)');
    					paletteSection.style.setProperty('--dynamic-dl-track-color', 'rgba(255, 255, 255, 0.3)');
    					paletteSection.style.setProperty('--dynamic-dl-thumb-color', '#FFFFFF');
    				} else {
    					paletteSection.style.removeProperty('--dynamic-icon-color');
    					paletteSection.style.removeProperty('--dynamic-pinned-icon-color');
    					paletteSection.style.removeProperty('--dynamic-locked-icon-color');
    					paletteSection.style.removeProperty('--dynamic-slider-thumb-color');
    					paletteSection.style.removeProperty('--dynamic-slider-track-color');
    					paletteSection.style.setProperty('--dynamic-dl-track-color', '#9299a5'); // Darker gray track
    					paletteSection.style.removeProperty('--dynamic-dl-thumb-color');
    				}
    				if (shouldSaveState) {
    					saveState();
    				}
    				checkForChanges();
    				updatePaletteResetButtons(); // Add this to update reset button state
    			}
    			function resetPaletteBackground(paletteSection, shouldSaveState = true) {
    				const paletteId = paletteSection.dataset.paletteId;
    				delete paletteBackgrounds[paletteId];
    				paletteSection.classList.remove('custom-bg');
    				paletteSection.style.background = ''; // Resets to stylesheet value
    				paletteSection.style.removeProperty('--dynamic-text-color');
    				paletteSection.style.removeProperty('--dynamic-icon-color');
    				paletteSection.style.removeProperty('--dynamic-pinned-icon-color');
    				paletteSection.style.removeProperty('--dynamic-locked-icon-color');
    				paletteSection.style.removeProperty('--dynamic-slider-thumb-color');
    				paletteSection.style.removeProperty('--dynamic-slider-track-color');
    				paletteSection.style.removeProperty('--dynamic-dl-track-color');
    				paletteSection.style.removeProperty('--dynamic-dl-thumb-color');
    				if (shouldSaveState) {
    					saveState();
    				}
    				checkForChanges();
    				updatePaletteResetButtons(); // Add this to update reset button state
    			}
    			function createPaletteControls(paletteType) {
    				const controls = document.createElement('div');
    				controls.className = 'cg-palette-controls';
    				const controlsColumn = document.createElement('div');
    				controlsColumn.className = 'cg-palette-controls-column';
    				if (paletteType === 'monochromatic') {
    					const topRow = document.createElement('div');
    					topRow.className = 'cg-palette-controls-row';
    					const spreadGroup = document.createElement('div');
    					spreadGroup.className = 'cg-range-with-label';
    					const spreadLabel = document.createElement('div');
    					spreadLabel.className = 'cg-range-label';
    					spreadLabel.textContent = 'Spread';
    					const spreadSliderGroup = document.createElement('div');
    					spreadSliderGroup.className = 'cg-palette-slider-group';
    					const spreadSlider = document.createElement('input');
    					spreadSlider.type = 'range';
    					spreadSlider.className = 'cg-palette-slider';
    					spreadSlider.min = '15'; spreadSlider.max = '60'; spreadSlider.value = monochromaticSpread;
    					spreadSlider.dataset.default = '35';
    					const spreadValue = document.createElement('span');
    					spreadValue.textContent = monochromaticSpread + '%';
    					spreadValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					spreadSlider.addEventListener('input', (e) => {
    						monochromaticSpread = parseInt(e.target.value);
    						spreadValue.textContent = monochromaticSpread + '%';
    						updateColorsAndDisplays();
    					});
    					spreadSlider.addEventListener('change', saveState);
    					spreadSliderGroup.appendChild(spreadSlider); spreadSliderGroup.appendChild(spreadValue);
    					spreadGroup.appendChild(spreadLabel); spreadGroup.appendChild(spreadSliderGroup);
    					topRow.appendChild(spreadGroup);
    					const accentHueGroup = document.createElement('div');
    					accentHueGroup.className = 'cg-range-with-label';
    					const accentHueLabel = document.createElement('div');
    					accentHueLabel.className = 'cg-range-label';
    					accentHueLabel.textContent = 'Accent Hue';
    					const accentHueSliderGroup = document.createElement('div');
    					accentHueSliderGroup.className = 'cg-palette-slider-group';
    					const accentHueSlider = document.createElement('input');
    					accentHueSlider.type = 'range';
    					accentHueSlider.className = 'cg-palette-slider';
    					accentHueSlider.min = '-30'; accentHueSlider.max = '30'; accentHueSlider.value = accentHueShift;
    					accentHueSlider.dataset.default = '0';
    					const accentHueValue = document.createElement('span');
    					accentHueValue.textContent = (accentHueShift >= 0 ? '+' : '') + accentHueShift + '°';
    					accentHueValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					accentHueSlider.addEventListener('input', (e) => {
    						accentHueShift = parseInt(e.target.value);
    						accentHueValue.textContent = (accentHueShift >= 0 ? '+' : '') + accentHueShift + '°';
    						updateColorsAndDisplays();
    					});
    					accentHueSlider.addEventListener('change', saveState);
    					accentHueSliderGroup.appendChild(accentHueSlider); accentHueSliderGroup.appendChild(accentHueValue);
    					accentHueGroup.appendChild(accentHueLabel); accentHueGroup.appendChild(accentHueSliderGroup);
    					topRow.appendChild(accentHueGroup);
    					controlsColumn.appendChild(topRow);
    					const bottomRow = document.createElement('div');
    					bottomRow.className = 'cg-palette-controls-row';
    					const accentBrightGroup = document.createElement('div');
    					accentBrightGroup.className = 'cg-range-with-label';
    					const accentBrightLabel = document.createElement('div');
    					accentBrightLabel.className = 'cg-range-label';
    					accentBrightLabel.textContent = 'Accent Bright.';
    					const accentBrightSliderGroup = document.createElement('div');
    					accentBrightSliderGroup.className = 'cg-palette-slider-group';
    					const accentBrightSlider = document.createElement('input');
    					accentBrightSlider.type = 'range';
    					accentBrightSlider.className = 'cg-palette-slider';
    					accentBrightSlider.min = '-40'; accentBrightSlider.max = '20'; accentBrightSlider.value = accentBrightnessShift;
    					accentBrightSlider.dataset.default = '0';
    					const accentBrightValue = document.createElement('span');
    					accentBrightValue.textContent = (accentBrightnessShift >= 0 ? '+' : '') + accentBrightnessShift;
    					accentBrightValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					accentBrightSlider.addEventListener('input', (e) => {
    						accentBrightnessShift = parseInt(e.target.value);
    						accentBrightValue.textContent = (accentBrightnessShift >= 0 ? '+' : '') + accentBrightnessShift;
    						updateColorsAndDisplays();
    					});
    					accentBrightSlider.addEventListener('change', saveState);
    					accentBrightSliderGroup.appendChild(accentBrightSlider); accentBrightSliderGroup.appendChild(accentBrightValue);
    					accentBrightGroup.appendChild(accentBrightLabel); accentBrightGroup.appendChild(accentBrightSliderGroup);
    					bottomRow.appendChild(accentBrightGroup);
    					const accentSatGroup = document.createElement('div');
    					accentSatGroup.className = 'cg-range-with-label';
    					const accentSatLabel = document.createElement('div');
    					accentSatLabel.className = 'cg-range-label';
    					accentSatLabel.textContent = 'Accent Sat.';
    					const accentSatSliderGroup = document.createElement('div');
    					accentSatSliderGroup.className = 'cg-palette-slider-group';
    					const accentSatSlider = document.createElement('input');
    					accentSatSlider.type = 'range';
    					accentSatSlider.className = 'cg-palette-slider';
    					accentSatSlider.min = '-80'; accentSatSlider.max = '40'; accentSatSlider.value = accentSaturationShift;
    					accentSatSlider.dataset.default = '0';
    					const accentSatValue = document.createElement('span');
    					accentSatValue.textContent = (accentSaturationShift >= 0 ? '+' : '') + accentSaturationShift + '%';
    					accentSatValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					accentSatSlider.addEventListener('input', (e) => {
    						accentSaturationShift = parseInt(e.target.value);
    						accentSatValue.textContent = (accentSaturationShift >= 0 ? '+' : '') + accentSaturationShift + '%';
    						updateColorsAndDisplays();
    					});
    					accentSatSlider.addEventListener('change', saveState);
    					accentSatSliderGroup.appendChild(accentSatSlider); accentSatSliderGroup.appendChild(accentSatValue);
    					accentSatGroup.appendChild(accentSatLabel); accentSatGroup.appendChild(accentSatSliderGroup);
    					bottomRow.appendChild(accentSatGroup);
    					controlsColumn.appendChild(bottomRow);
    				}
    				else if (paletteType === 'dominant') {
    					const row1 = document.createElement('div');
    					row1.className = 'cg-palette-controls-row';
    					const rangeGroup = document.createElement('div');
    					rangeGroup.className = 'cg-range-with-label';
    					const rangeLabel = document.createElement('div');
    					rangeLabel.className = 'cg-range-label';
    					rangeLabel.textContent = 'Accent Intensity';
    					const rangeSliderGroup = document.createElement('div');
    					rangeSliderGroup.className = 'cg-palette-slider-group';
    					const rangeSlider = document.createElement('input');
    					rangeSlider.type = 'range';
    					rangeSlider.className = 'cg-palette-slider';
    					rangeSlider.min = '0'; rangeSlider.max = '100'; rangeSlider.value = accentIntensity;
    					rangeSlider.dataset.default = '70';
    					const rangeValue = document.createElement('span');
    					rangeValue.textContent = accentIntensity + '%';
    					rangeValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					rangeSlider.addEventListener('input', (e) => { accentIntensity = parseInt(e.target.value); rangeValue.textContent = accentIntensity + '%'; updateColorsAndDisplays(); });
    					rangeSlider.addEventListener('change', saveState);
    					rangeSliderGroup.appendChild(rangeSlider); rangeSliderGroup.appendChild(rangeValue);
    					rangeGroup.appendChild(rangeLabel); rangeGroup.appendChild(rangeSliderGroup);
    					const toggleGroup = document.createElement('div');
    					toggleGroup.className = 'cg-dropdown-group';
    					const toggleLabelText = document.createElement('div');
    					toggleLabelText.className = 'cg-dropdown-label';
    					toggleLabelText.textContent = 'Type';
    					const dropdownElement = createDropdown(
    						[{value: '30°', text: '30°'}, {value: '120°', text: '120°'}, {value: '180°', text: '180°'}, {value: '15°', text: '15°'}],
    						dominantRelationship,
    						(e) => { dominantRelationship = e.target.value; updateColorsAndDisplays(); saveState(); }
    					);
    					dropdownElement.dataset.default = '30°';
    					toggleGroup.appendChild(toggleLabelText); toggleGroup.appendChild(dropdownElement);
    					row1.appendChild(rangeGroup);
    					row1.appendChild(toggleGroup);
    					controlsColumn.appendChild(row1);
    					const row2 = document.createElement('div');
    					row2.className = 'cg-palette-controls-row';
    					const distGroup = document.createElement('div');
    					distGroup.className = 'cg-range-with-label';
    					distGroup.style.flex = '1';
    					const distLabel = document.createElement('div');
    					distLabel.className = 'cg-range-label';
    					distLabel.textContent = 'Balance';
    					const distSliderGroup = document.createElement('div');
    					distSliderGroup.className = 'cg-palette-slider-group';
    					const distSlider = document.createElement('input');
    					distSlider.type = 'range';
    					distSlider.className = 'cg-palette-slider';
    					distSlider.min = '40'; distSlider.max = '70'; distSlider.value = dominantDistribution;
    					distSlider.dataset.default = '60';
    					const distValue = document.createElement('span');
    					distValue.style.cssText = 'font-size: 12px; color: #5BA7F7; width: 100%; text-align: center;';
    					const updateDistLabel = (val) => {
    						if (val <= 40) distValue.textContent = 'Equal';
    						else if (val >= 70) distValue.textContent = 'Heavy';
    						else if (val >= 59 && val <= 61) distValue.textContent = 'Classic';
    						else distValue.textContent = val + '%';
    					};
    					distSlider.addEventListener('input', (e) => { 
    						dominantDistribution = parseInt(e.target.value); 
    						updateDistLabel(dominantDistribution);
    						updateColorsAndDisplays(); 
    					});
    					distSlider.addEventListener('change', saveState);
    					updateDistLabel(dominantDistribution);
    					distSliderGroup.appendChild(distSlider);
    					distSliderGroup.appendChild(distValue);
    					distGroup.appendChild(distLabel);
    					distGroup.appendChild(distSliderGroup);
    					row2.appendChild(distGroup);
    					controlsColumn.appendChild(row2);
    				} 
    				else if (paletteType === 'neutralpop') {
    					const topRow = document.createElement('div');
    					topRow.className = 'cg-palette-controls-row';
    					const spreadGroup = document.createElement('div');
    					spreadGroup.className = 'cg-range-with-label';
    					const spreadLabel = document.createElement('div');
    					spreadLabel.className = 'cg-range-label';
    					spreadLabel.textContent = 'Spread';
    					const spreadSliderGroup = document.createElement('div');
    					spreadSliderGroup.className = 'cg-palette-slider-group';
    					const spreadSlider = document.createElement('input');
    					spreadSlider.type = 'range';
    					spreadSlider.className = 'cg-palette-slider';
    					spreadSlider.min = '0'; 
    					spreadSlider.max = '50'; 
    					spreadSlider.value = neutralSpread;
    					spreadSlider.dataset.default = '25';
    					const spreadValue = document.createElement('span');
    					spreadValue.textContent = neutralSpread + '%';
    					spreadValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					spreadSlider.addEventListener('input', (e) => {
    						neutralSpread = parseInt(e.target.value);
    						spreadValue.textContent = neutralSpread + '%';
    						updateColorsAndDisplays();
    					});
    					spreadSlider.addEventListener('change', saveState);
    					spreadSliderGroup.appendChild(spreadSlider);
    					spreadSliderGroup.appendChild(spreadValue);
    					spreadGroup.appendChild(spreadLabel);
    					spreadGroup.appendChild(spreadSliderGroup);
    					topRow.appendChild(spreadGroup);
    					const toggleGroup = document.createElement('div');
    					toggleGroup.className = 'cg-dropdown-group';
    					const toggleLabelText = document.createElement('div');
    					toggleLabelText.className = 'cg-dropdown-label';
    					toggleLabelText.textContent = 'Strategy';
    					const dropdownElement = createDropdown(
    						[{value: 'true', text: 'True'}, {value: 'tinted', text: 'Tinted'}, {value: 'complement', text: 'Comp'}, {value: 'offset', text: 'Offset'}],
    						neutralStrategy,
    						(e) => { neutralStrategy = e.target.value; updateColorsAndDisplays(); saveState(); }
    					);
    					dropdownElement.dataset.default = 'tinted';
    					toggleGroup.appendChild(toggleLabelText);
    					toggleGroup.appendChild(dropdownElement);
    					topRow.appendChild(toggleGroup);
    					controlsColumn.appendChild(topRow);
    					const bottomRow = document.createElement('div');
    					bottomRow.className = 'cg-palette-controls-row';
    					const rangeGroup = document.createElement('div');
    					rangeGroup.className = 'cg-range-with-label';
    					const rangeLabel = document.createElement('div');
    					rangeLabel.className = 'cg-range-label';
    					rangeLabel.textContent = 'Neutral Sat.';
    					const rangeSliderGroup = document.createElement('div');
    					rangeSliderGroup.className = 'cg-palette-slider-group';
    					const rangeSlider = document.createElement('input');
    					rangeSlider.type = 'range';
    					rangeSlider.className = 'cg-palette-slider';
    					rangeSlider.min = '0';
    					rangeSlider.max = '30';
    					rangeSlider.value = neutralDepth;
    					rangeSlider.dataset.default = '8';
    					const rangeValue = document.createElement('span');
    					rangeValue.textContent = neutralDepth + '%';
    					rangeValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					rangeSlider.addEventListener('input', (e) => { neutralDepth = parseInt(e.target.value); rangeValue.textContent = neutralDepth + '%'; updateColorsAndDisplays(); });
    					rangeSlider.addEventListener('change', saveState);
    					rangeSliderGroup.appendChild(rangeSlider);
    					rangeSliderGroup.appendChild(rangeValue);
    					rangeGroup.appendChild(rangeLabel);
    					rangeGroup.appendChild(rangeSliderGroup);
    					bottomRow.appendChild(rangeGroup);
    					const neutralBrightGroup = document.createElement('div');
    					neutralBrightGroup.className = 'cg-range-with-label';
    					const neutralBrightLabel = document.createElement('div');
    					neutralBrightLabel.className = 'cg-range-label';
    					neutralBrightLabel.textContent = 'Neutral Bright.';
    					const neutralBrightSliderGroup = document.createElement('div');
    					neutralBrightSliderGroup.className = 'cg-palette-slider-group';
    					const neutralBrightSlider = document.createElement('input');
    					neutralBrightSlider.type = 'range';
    					neutralBrightSlider.className = 'cg-palette-slider';
    					neutralBrightSlider.min = '-40'; 
    					neutralBrightSlider.max = '40'; 
    					neutralBrightSlider.value = neutralBrightnessShift;
    					neutralBrightSlider.dataset.default = '0';
    					const neutralBrightValue = document.createElement('span');
    					neutralBrightValue.textContent = (neutralBrightnessShift >= 0 ? '+' : '') + neutralBrightnessShift;
    					neutralBrightValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					neutralBrightSlider.addEventListener('input', (e) => {
    						neutralBrightnessShift = parseInt(e.target.value);
    						neutralBrightValue.textContent = (neutralBrightnessShift >= 0 ? '+' : '') + neutralBrightnessShift;
    						updateColorsAndDisplays();
    					});
    					neutralBrightSlider.addEventListener('change', saveState);
    					neutralBrightSliderGroup.appendChild(neutralBrightSlider);
    					neutralBrightSliderGroup.appendChild(neutralBrightValue);
    					neutralBrightGroup.appendChild(neutralBrightLabel);
    					neutralBrightGroup.appendChild(neutralBrightSliderGroup);
    					bottomRow.appendChild(neutralBrightGroup);
    					controlsColumn.appendChild(bottomRow);
    				} 
    				else if (paletteType === 'warmcool') {
    					const topControlsRow = document.createElement('div');
    					topControlsRow.className = 'cg-palette-controls-row';
    					const ratioGroup = document.createElement('div');
    					ratioGroup.className = 'cg-dropdown-group';
    					const ratioLabel = document.createElement('div');
    					ratioLabel.className = 'cg-dropdown-label';
    					ratioLabel.textContent = 'Ratio';
    					const ratioDropdown = createDropdown(
    						[{value: '1:3', text: '1:3'}, {value: '2:2', text: '2:2'}],
    						warmCoolMode,
    						(e) => { warmCoolMode = e.target.value; updateWarmCoolDropdowns(); updateColorsAndDisplays(); saveState(); }
    					);
    					ratioDropdown.dataset.default = '1:3';
    					ratioGroup.appendChild(ratioLabel);
    					ratioGroup.appendChild(ratioDropdown);
    					const contrastGroup = document.createElement('div');
    					contrastGroup.className = 'cg-dropdown-group';
    					const contrastLabel = document.createElement('div');
    					contrastLabel.className = 'cg-dropdown-label';
    					contrastLabel.textContent = 'Contrast';
    					const contrastDropdown = createDropdown(
    						[{value: 'subtle', text: 'Subtle'}, {value: 'moderate', text: 'Moderate'}, {value: 'strong', text: 'Strong'}],
    						warmCoolContrast,
    						(e) => { warmCoolContrast = e.target.value; updateColorsAndDisplays(); saveState(); }
    					);
    					contrastDropdown.dataset.default = 'moderate';
    					contrastGroup.appendChild(contrastLabel);
    					contrastGroup.appendChild(contrastDropdown);
    					topControlsRow.appendChild(ratioGroup);
    					topControlsRow.appendChild(contrastGroup);
    					controlsColumn.appendChild(topControlsRow);
    					const bottomControlsRow = document.createElement('div');
    					bottomControlsRow.className = 'cg-palette-controls-row';
    					const shiftGroup = document.createElement('div');
    					shiftGroup.className = 'cg-range-with-label';
    					shiftGroup.style.flex = '1';
    					const shiftLabel = document.createElement('div');
    					shiftLabel.className = 'cg-range-label';
    					shiftLabel.textContent = 'Hue Shift';
    					const shiftSliderGroup = document.createElement('div');
    					shiftSliderGroup.className = 'cg-palette-slider-group';
    					const shiftSlider = document.createElement('input');
    					shiftSlider.type = 'range';
    					shiftSlider.className = 'cg-palette-slider';
    					shiftSlider.min = '-15';
    					shiftSlider.max = '15';
    					shiftSlider.value = temperatureShift;
    					shiftSlider.dataset.default = '0';
    					const shiftValue = document.createElement('span');
    					shiftValue.textContent = (temperatureShift >= 0 ? '+' : '') + temperatureShift + '°';
    					shiftValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					shiftSlider.addEventListener('input', (e) => {
    						temperatureShift = parseInt(e.target.value);
    						shiftValue.textContent = (temperatureShift >= 0 ? '+' : '') + temperatureShift + '°';
    						updateColorsAndDisplays();
    					});
    					shiftSlider.addEventListener('change', saveState);
    					shiftSliderGroup.appendChild(shiftSlider);
    					shiftSliderGroup.appendChild(shiftValue);
    					shiftGroup.appendChild(shiftLabel);
    					shiftGroup.appendChild(shiftSliderGroup);
    					bottomControlsRow.appendChild(shiftGroup);
    					controlsColumn.appendChild(bottomControlsRow);
    				} 
    				else if (paletteType === 'analogous') {
    					const topControlsRow = document.createElement('div');
    					topControlsRow.className = 'cg-palette-controls-row';
    					const rangeGroup = document.createElement('div');
    					rangeGroup.className = 'cg-range-with-label';
    					rangeGroup.style.flex = '1';
    					const rangeLabel = document.createElement('div');
    					rangeLabel.className = 'cg-range-label';
    					rangeLabel.textContent = 'Spread';
    					const rangeSliderGroup = document.createElement('div');
    					rangeSliderGroup.className = 'cg-palette-slider-group';
    					const rangeSlider = document.createElement('input');
    					rangeSlider.type = 'range';
    					rangeSlider.className = 'cg-palette-slider';
    					rangeSlider.min = '30';
    					rangeSlider.max = '150';
    					rangeSlider.value = analogousRange;
    					rangeSlider.dataset.default = '60';
    					const rangeValue = document.createElement('span');
    					rangeValue.textContent = analogousRange + '°';
    					rangeValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					rangeSlider.addEventListener('input', (e) => { analogousRange = parseInt(e.target.value); rangeValue.textContent = analogousRange + '°'; updateColorsAndDisplays(); });
    					rangeSlider.addEventListener('change', saveState);
    					rangeSliderGroup.appendChild(rangeSlider);
    					rangeSliderGroup.appendChild(rangeValue);
    					rangeGroup.appendChild(rangeLabel);
    					rangeGroup.appendChild(rangeSliderGroup);
    					topControlsRow.appendChild(rangeGroup);
    					const bottomControlsRow = document.createElement('div');
    					bottomControlsRow.className = 'cg-palette-controls-row';
    					const toggleGroup = document.createElement('div');
    					toggleGroup.className = 'cg-dropdown-group';
    					const toggleLabelText = document.createElement('div');
    					toggleLabelText.className = 'cg-dropdown-label';
    					toggleLabelText.textContent = 'Color #';
    					const colorCountDropdown = createDropdown(
    						[{value: '3', text: '3'}, {value: '4', text: '4'}],
    						analogousColorCount,
    						(e) => { analogousColorCount = parseInt(e.target.value); updateAnalogousDropdowns(); updateColorsAndDisplays(); saveState(); }
    					);
    					colorCountDropdown.dataset.default = '3';
    					toggleGroup.appendChild(toggleLabelText);
    					toggleGroup.appendChild(colorCountDropdown);
    					const distGroup = document.createElement('div');
    					distGroup.className = 'cg-dropdown-group';
    					const distLabel = document.createElement('div');
    					distLabel.className = 'cg-dropdown-label';
    					distLabel.textContent = 'Distribution';
    					const distDropdown = createDropdown(
    						[{value: 'even', text: 'Even'}, {value: 'gradual', text: 'Gradual'}, {value: 'clustered', text: 'Clustered'}],
    						analogousDistribution,
    						(e) => { analogousDistribution = e.target.value; updateColorsAndDisplays(); saveState(); }
    					);
    					distDropdown.dataset.default = 'even';
    					distGroup.appendChild(distLabel);
    					distGroup.appendChild(distDropdown);
    					bottomControlsRow.appendChild(toggleGroup);
    					bottomControlsRow.appendChild(distGroup);
    					controlsColumn.appendChild(topControlsRow);
    					controlsColumn.appendChild(bottomControlsRow);
    				} 
    				else if (paletteType === 'complementary') {
    					const balanceRow = document.createElement('div');
    					balanceRow.className = 'cg-palette-controls-row';
    					const balanceGroup = document.createElement('div');
    					balanceGroup.className = 'cg-range-with-label';
    					balanceGroup.style.flex = '1';
    					const balanceLabel = document.createElement('div');
    					balanceLabel.className = 'cg-range-label';
    					balanceLabel.textContent = 'Ratio';
    					const balanceSliderGroup = document.createElement('div');
    					balanceSliderGroup.className = 'cg-palette-slider-group';
    					const balanceSlider = document.createElement('input');
    					balanceSlider.type = 'range';
    					balanceSlider.className = 'cg-palette-slider';
    					balanceSlider.min = '10';
    					balanceSlider.max = '90';
    					balanceSlider.value = complementaryBalance;
    					balanceSlider.dataset.default = '70';
    					const balanceValue = document.createElement('span');
    					balanceValue.textContent = complementaryBalance + '/' + (100 - complementaryBalance);
    					balanceValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					balanceSlider.addEventListener('input', (e) => { complementaryBalance = parseInt(e.target.value); balanceValue.textContent = complementaryBalance + '/' + (100 - complementaryBalance); updateColorsAndDisplays(); });
    					balanceSlider.addEventListener('change', saveState);
    					balanceSliderGroup.appendChild(balanceSlider);
    					balanceSliderGroup.appendChild(balanceValue);
    					balanceGroup.appendChild(balanceLabel);
    					balanceGroup.appendChild(balanceSliderGroup);
    					balanceRow.appendChild(balanceGroup);
    					controlsColumn.appendChild(balanceRow);
    					const tensionBridgeRow = document.createElement('div');
    					tensionBridgeRow.className = 'cg-palette-controls-row';
    					const tensionGroup = document.createElement('div');
    					tensionGroup.className = 'cg-range-with-label';
    					const tensionLabel = document.createElement('div');
    					tensionLabel.className = 'cg-range-label';
    					tensionLabel.textContent = 'Hue Shift';
    					const tensionSliderGroup = document.createElement('div');
    					tensionSliderGroup.className = 'cg-palette-slider-group';
    					const tensionSlider = document.createElement('input');
    					tensionSlider.type = 'range';
    					tensionSlider.className = 'cg-palette-slider';
    					tensionSlider.min = '-30';
    					tensionSlider.max = '30';
    					tensionSlider.value = complementaryTension;
    					tensionSlider.dataset.default = '0';
    					const tensionValue = document.createElement('span');
    					tensionValue.textContent = (complementaryTension >= 0 ? '+' : '') + complementaryTension + '°';
    					tensionValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					tensionSlider.addEventListener('input', (e) => { complementaryTension = parseInt(e.target.value); tensionValue.textContent = (complementaryTension >= 0 ? '+' : '') + complementaryTension + '°'; updateColorsAndDisplays(); });
    					tensionSlider.addEventListener('change', saveState);
    					tensionSliderGroup.appendChild(tensionSlider);
    					tensionSliderGroup.appendChild(tensionValue);
    					tensionGroup.appendChild(tensionLabel);
    					tensionGroup.appendChild(tensionSliderGroup);
    					const brightModeToggle = document.createElement('div');
    					brightModeToggle.className = 'cg-bridge-toggle';
    					const brightModeLabel = document.createElement('label');
    					brightModeLabel.className = 'cg-bridge-label';
    					brightModeLabel.setAttribute('for', 'brightModeToggleComp');
    					brightModeLabel.innerHTML = `<span class="sun-icon-wrapper" title="Light mode"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></span> <span class="moon-icon-wrapper" title="Dark mode"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></span>`;
    					const sunIcon = brightModeLabel.querySelector('.sun-icon-wrapper');
    					const moonIcon = brightModeLabel.querySelector('.moon-icon-wrapper');
    					const brightModeSwitch = document.createElement('label');
    					brightModeSwitch.className = 'cg-bridge-switch';
    					const brightModeInput = document.createElement('input');
    					brightModeInput.type = 'checkbox';
    					brightModeInput.id = 'brightModeToggleComp';
    					brightModeInput.checked = (complementaryBrightnessMode === 'dark');
    					brightModeInput.dataset.default = 'light';
    					if (brightModeInput.checked) {
    						sunIcon.style.opacity = '0.4';
    						moonIcon.style.opacity = '1';
    					} else {
    						sunIcon.style.opacity = '1';
    						moonIcon.style.opacity = '0.4';
    					}
    					brightModeInput.addEventListener('change', (e) => {
    						complementaryBrightnessMode = e.target.checked ? 'dark' : 'light';
    						if (e.target.checked) {
    							sunIcon.style.opacity = '0.4';
    							moonIcon.style.opacity = '1';
    						} else {
    							sunIcon.style.opacity = '1';
    							moonIcon.style.opacity = '0.4';
    						}
    						updateColorsAndDisplays();
    						saveState();
    					});
    					const brightModeSlider = document.createElement('span');
    					brightModeSlider.className = 'cg-bridge-slider';
    					brightModeSwitch.appendChild(brightModeInput);
    					brightModeSwitch.appendChild(brightModeSlider);
    					brightModeToggle.appendChild(brightModeLabel);
    					brightModeToggle.appendChild(brightModeSwitch);
    					tensionBridgeRow.appendChild(tensionGroup);
    					tensionBridgeRow.appendChild(brightModeToggle);
    					controlsColumn.appendChild(tensionBridgeRow);
    				} 
    				else if (paletteType === 'split') {
    					const angleRow = document.createElement('div');
    					angleRow.className = 'cg-palette-controls-row';
    					const sliderGroupWithLabel = document.createElement('div');
    					sliderGroupWithLabel.className = 'cg-range-with-label';
    					sliderGroupWithLabel.style.flex = '1';
    					const title = document.createElement('div');
    					title.className = 'cg-range-label';
    					title.textContent = 'Split Angle';
    					const sliderGroup = document.createElement('div');
    					sliderGroup.className = 'cg-palette-slider-group';
    					const slider = document.createElement('input');
    					slider.type = 'range';
    					slider.className = 'cg-palette-slider';
    					slider.min = '20';
    					slider.max = '60';
    					slider.value = splitAngle;
    					slider.dataset.default = '30';
    					const value = document.createElement('span');
    					value.textContent = splitAngle + '°';
    					value.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					slider.addEventListener('input', (e) => { 
    						splitAngle = parseInt(e.target.value); 
    						value.textContent = splitAngle + '°'; 
    						updateColorsAndDisplays(); 
    					});
    					slider.addEventListener('change', saveState);
    					sliderGroup.appendChild(slider);
    					sliderGroup.appendChild(value);
    					sliderGroupWithLabel.appendChild(title);
    					sliderGroupWithLabel.appendChild(sliderGroup);
    					angleRow.appendChild(sliderGroupWithLabel);
    					controlsColumn.appendChild(angleRow);
    					const advancedRow = document.createElement('div');
    					advancedRow.className = 'cg-palette-controls-row';
    					const satDistGroup = document.createElement('div');
    					satDistGroup.className = 'cg-dropdown-group';
    					const satDistLabel = document.createElement('div');
    					satDistLabel.className = 'cg-dropdown-label';
    					satDistLabel.textContent = 'Sat. Dist.';
    					const satDistDropdown = createDropdown(
    						[
    							{value: 'equal', text: 'Equal'},
    							{value: 'cascade', text: 'Cascade'},
    							{value: 'diverge', text: 'Diverge'},
    							{value: 'primary-focus', text: 'Primary'}
    						],
    						splitSatDistribution,
    						(e) => { 
    							splitSatDistribution = e.target.value; 
    							updateColorsAndDisplays(); 
    							saveState();
    						}
    					);
    					satDistDropdown.dataset.default = 'equal';
    					satDistGroup.appendChild(satDistLabel);
    					satDistGroup.appendChild(satDistDropdown);
    					advancedRow.appendChild(satDistGroup);
    					const emphasisGroup = document.createElement('div');
    					emphasisGroup.className = 'cg-dropdown-group';
    					const emphasisLabel = document.createElement('div');
    					emphasisLabel.className = 'cg-dropdown-label';
    					emphasisLabel.textContent = 'Emphasis';
    					const emphasisDropdown = createDropdown(
    						[{value: 'primary-focused', text: 'Primary'}, 
    						 {value: 'split-focused', text: 'Split'}, 
    						 {value: 'balanced', text: 'Balanced'}],
    						splitEmphasis,
    						(e) => { 
    							splitEmphasis = e.target.value; 
    							updateColorsAndDisplays(); 
    							saveState();
    						}
    					);
    					emphasisDropdown.dataset.default = 'balanced';
    					emphasisGroup.appendChild(emphasisLabel);
    					emphasisGroup.appendChild(emphasisDropdown);
    					advancedRow.appendChild(emphasisGroup);
    					controlsColumn.appendChild(advancedRow);
    				}
    				else if (paletteType === 'triadic') {
    					const row1 = document.createElement('div');
    					row1.className = 'cg-palette-controls-row';
    					const balanceDropdownGroup = document.createElement('div');
    					balanceDropdownGroup.className = 'cg-dropdown-group';
    					balanceDropdownGroup.style.flex = '1';
    					const balanceDropdownLabel = document.createElement('div');
    					balanceDropdownLabel.className = 'cg-dropdown-label';
    					balanceDropdownLabel.textContent = 'Balance Mode';
    					const balanceDropdownElement = createDropdown(
    						[
    							{value: 'equal', text: 'Equal (120°)'},
    							{value: 'major', text: 'Major (100°/140°)'},
    							{value: 'minor', text: 'Minor (90°/90°)'},
    							{value: 'golden', text: 'Golden (137.5°)'}
    						],
    						triadicBalanceMode,
    						(e) => { triadicBalanceMode = e.target.value; updateColorsAndDisplays(); saveState(); }
    					);
    					balanceDropdownElement.dataset.default = 'equal';
    					balanceDropdownGroup.appendChild(balanceDropdownLabel);
    					balanceDropdownGroup.appendChild(balanceDropdownElement);
    					row1.appendChild(balanceDropdownGroup);
    					controlsColumn.appendChild(row1);
    					const row2 = document.createElement('div');
    					row2.className = 'cg-palette-controls-row';
    					const vibranceDropdownGroup = document.createElement('div');
    					vibranceDropdownGroup.className = 'cg-dropdown-group';
    					vibranceDropdownGroup.style.flex = '1';
    					const vibranceDropdownLabel = document.createElement('div');
    					vibranceDropdownLabel.className = 'cg-dropdown-label';
    					vibranceDropdownLabel.textContent = 'Saturation Dist.';
    					const vibranceDropdownElement = createDropdown(
    						[
    							{value: 'equal', text: 'Equal'},
    							{value: 'full', text: 'Full'},
    							{value: 'cascade', text: 'Cascade'},
    							{value: 'primary-muted', text: 'Primary + Muted'},
    							{value: 'duotone-accent', text: 'Duotone + Accent'}
    						],
    						triadicVibrance,
    						(e) => { triadicVibrance = e.target.value; updateColorsAndDisplays(); saveState(); }
    					);
    					vibranceDropdownElement.dataset.default = 'equal';
    					vibranceDropdownGroup.appendChild(vibranceDropdownLabel);
    					vibranceDropdownGroup.appendChild(vibranceDropdownElement);
    					row2.appendChild(vibranceDropdownGroup);
    					controlsColumn.appendChild(row2);
    				} 
    				else if (paletteType === 'tetradic') {
    					const topRow = document.createElement('div');
    					topRow.className = 'cg-palette-controls-row';
    					const pairingGroup = document.createElement('div');
    					pairingGroup.className = 'cg-dropdown-group';
    					const pairingLabel = document.createElement('div');
    					pairingLabel.className = 'cg-dropdown-label';
    					pairingLabel.textContent = 'Pairing';
    					const pairingDropdown = createDropdown(
    						[{value: 'rectangle', text: 'Rectangle'}, {value: 'square', text: 'Square'}, {value: 'double-split', text: 'Dbl Split'}],
    						tetradicPairingMode,
    						(e) => { tetradicPairingMode = e.target.value; updateColorsAndDisplays(); saveState(); }
    					);
    					pairingDropdown.dataset.default = 'rectangle';
    					pairingGroup.appendChild(pairingLabel);
    					pairingGroup.appendChild(pairingDropdown);
    					const satGroup = document.createElement('div');
    					satGroup.className = 'cg-dropdown-group';
    					const satLabel = document.createElement('div');
    					satLabel.className = 'cg-dropdown-label';
    					satLabel.textContent = 'Sat. Dist.';
    					const satDropdown = createDropdown(
    						[{value: 'all-equal', text: 'Equal'}, {value: 'alternating', text: 'Alternate'}, {value: 'gradual', text: 'Gradual'}, {value: 'primary-focus', text: 'Primary'}],
    						tetradicSaturationStrategy,
    						(e) => { tetradicSaturationStrategy = e.target.value; updateColorsAndDisplays(); saveState(); }
    					);
    					satDropdown.dataset.default = 'all-equal';
    					satGroup.appendChild(satLabel);
    					satGroup.appendChild(satDropdown);
    					topRow.appendChild(pairingGroup);
    					topRow.appendChild(satGroup);
    					controlsColumn.appendChild(topRow);
    					const bottomRow = document.createElement('div');
    					bottomRow.className = 'cg-palette-controls-row';
    					const dominanceGroup = document.createElement('div');
    					dominanceGroup.className = 'cg-range-with-label';
    					dominanceGroup.style.flex = '1';
    					const dominanceLabel = document.createElement('div');
    					dominanceLabel.className = 'cg-range-label';
    					dominanceLabel.textContent = 'Dominance';
    					const dominanceSliderGroup = document.createElement('div');
    					dominanceSliderGroup.className = 'cg-palette-slider-group';
    					const dominanceSlider = document.createElement('input');
    					dominanceSlider.type = 'range';
    					dominanceSlider.className = 'cg-palette-slider';
    					dominanceSlider.min = '0';
    					dominanceSlider.max = '100';
    					dominanceSlider.value = tetradicDominance;
    					dominanceSlider.dataset.default = '50';
    					const dominanceValue = document.createElement('span');
    					dominanceValue.textContent = tetradicDominance + '%';
    					dominanceValue.style.cssText = 'font-size: 12px; color: #5BA7F7;';
    					dominanceSlider.addEventListener('input', (e) => {
    						tetradicDominance = parseInt(e.target.value);
    						dominanceValue.textContent = tetradicDominance + '%';
    						updateColorsAndDisplays();
    					});
    					dominanceSlider.addEventListener('change', saveState);
    					dominanceSliderGroup.appendChild(dominanceSlider);
    					dominanceSliderGroup.appendChild(dominanceValue);
    					dominanceGroup.appendChild(dominanceLabel);
    					dominanceGroup.appendChild(dominanceSliderGroup);
    					bottomRow.appendChild(dominanceGroup);
    					controlsColumn.appendChild(bottomRow);
    				}
    				if (controlsColumn.children.length > 0) {
    					 controls.appendChild(controlsColumn);
    					 return controls;
    				}
    				return null;
    			}
    			function createDarkLightAdvancedControls(paletteType) {
    				const defaults = darkLightAdvancedControls[paletteType];
    				const container = document.createElement('div');
    				container.className = 'cg-dark-light-controls';
    				container.innerHTML = `
    					<div class="cg-dark-light-saturation-controls">
    						<div class="cg-saturation-control-group">
    							<label class="cg-saturation-label">Dark Saturation</label>
    							<input type="range" class="cg-palette-slider cg-dl-slider cg-saturation-slider" data-type="darkSat" min="0" max="100" value="${defaults.darkSat}" data-default="${defaults.darkSat}">
    							<span class="cg-saturation-value">${defaults.darkSat}%</span>
    						</div>
    						<div class="cg-saturation-control-group">
    							<label class="cg-saturation-label">Light Saturation</label>
    							<input type="range" class="cg-palette-slider cg-dl-slider cg-saturation-slider" data-type="lightSat" min="0" max="100" value="${defaults.lightSat}" data-default="${defaults.lightSat}">
    							<span class="cg-saturation-value">${defaults.lightSat}%</span>
    						</div>
    					</div>
    					<div class="cg-brightness-controls">
    						<div class="cg-brightness-slider-wrapper">
    							<span class="cg-brightness-value-side" data-type="darkBrightVal">${defaults.darkBright}%</span>
    					<div class="cg-brightness-range-container">
    						<input type="range" class="cg-brightness-slider-1 cg-dl-slider" data-type="darkBright" min="-50" max="0" value="${defaults.darkBright}" data-default="${defaults.darkBright}">
    						<input type="range" class="cg-brightness-slider-2 cg-dl-slider" data-type="lightBright" min="0" max="50" value="${defaults.lightBright}" data-default="${defaults.lightBright}">
    						<div class="cg-brightness-track-container">
    							<div class="cg-brightness-track-bg"></div>
    							<div class="cg-brightness-track-left"></div>
    							<div class="cg-brightness-track-right"></div>
    						</div>
    						<div class="cg-brightness-center-grip" title="Drag to adjust spread"></div>
    					</div>
    							<span class="cg-brightness-value-side" data-type="lightBrightVal">+${defaults.lightBright}%</span>
    						</div>
    					</div>
    				`;
    				container.querySelectorAll('.cg-saturation-slider').forEach(slider => {
    					slider.addEventListener('input', (e) => {
    						const type = e.target.dataset.type;
    						const value = parseInt(e.target.value);
    						darkLightAdvancedControls[paletteType][type] = value;
    						e.target.nextElementSibling.textContent = `${value}%`;
    						updateColorsAndDisplays();
    					});
    					slider.addEventListener('change', saveState);
    				});
    				initializeDoubleSlider(container.querySelector('.cg-brightness-range-container'), paletteType);
    				return container;
    			}
    			function initializeDoubleSlider(container, paletteType) {
    				const wrapper = container.parentElement;
    				const slider1 = container.querySelector('.cg-brightness-slider-1');
    				const slider2 = container.querySelector('.cg-brightness-slider-2');
    				const centerGrip = container.querySelector('.cg-brightness-center-grip');
    				const value1Display = wrapper.querySelector('[data-type="darkBrightVal"]');
    				const value2Display = wrapper.querySelector('[data-type="lightBrightVal"]');
    				const trackLeft = container.querySelector('.cg-brightness-track-left');
    				const trackRight = container.querySelector('.cg-brightness-track-right');
    				const min1 = parseInt(slider1.min);
    				const max1 = parseInt(slider1.max);
    				const min2 = parseInt(slider2.min);
    				const max2 = parseInt(slider2.max);
    				function updateVisuals() {
    					const val1 = parseInt(slider1.value);
    					const val2 = parseInt(slider2.value);
    					value1Display.textContent = `${val1}%`;
    					value2Display.textContent = `+${val2}%`;
    					const leftPercentage = ((max1 - val1) / (max1 - min1)) * 50;
    					trackLeft.style.width = leftPercentage + '%';
    					const rightPercentage = ((val2 - min2) / (max2 - min2)) * 50;
    					trackRight.style.width = rightPercentage + '%';
    				}
    				function handleSliderInput(e) {
    					const isFirstSlider = e.target === slider1;
    					if (isFirstSlider) {
    						darkLightAdvancedControls[paletteType].darkBright = parseInt(e.target.value);
    					} else {
    						darkLightAdvancedControls[paletteType].lightBright = parseInt(e.target.value);
    					}
    					updateVisuals();
    					updateColorsAndDisplays();
    				}
    				slider1.addEventListener('input', handleSliderInput);
    				slider2.addEventListener('input', handleSliderInput);
    				slider1.addEventListener('change', saveState);
    				slider2.addEventListener('change', saveState);
    				centerGrip.addEventListener('mousedown', (e) => {
    					e.preventDefault();
    					const rect = container.getBoundingClientRect();
    					const startX = e.clientX;
    					const containerWidth = rect.width;
    					const startVal1 = parseInt(slider1.value);
    					const startVal2 = parseInt(slider2.value);
    					function onMouseMove(moveEvent) {
    						const dx = moveEvent.clientX - startX;
    						const dxPercent = (dx / containerWidth) * 200;
    						const range1 = max1 - min1;
    						const range2 = max2 - min2;
    						const valueChange1 = -(dxPercent / 100) * (range1 / 2);
    						const valueChange2 = (dxPercent / 100) * (range2 / 2);
    						let newVal1 = startVal1 + valueChange1;
    						let newVal2 = startVal2 + valueChange2;
    						newVal1 = Math.round(Math.max(min1, Math.min(max1, newVal1)));
    						newVal2 = Math.round(Math.max(min2, Math.min(max2, newVal2)));
    						if (newVal1 !== parseInt(slider1.value)) {
    							slider1.value = newVal1;
    							darkLightAdvancedControls[paletteType].darkBright = newVal1;
    						}
    						if (newVal2 !== parseInt(slider2.value)) {
    							slider2.value = newVal2;
    							darkLightAdvancedControls[paletteType].lightBright = newVal2;
    						}
    						updateVisuals();
    						updateColorsAndDisplays();
    					}
    					function onMouseUp() {
    						document.removeEventListener('mousemove', onMouseMove);
    						document.removeEventListener('mouseup', onMouseUp);
    						saveState();
    					}
    					document.addEventListener('mousemove', onMouseMove);
    					document.addEventListener('mouseup', onMouseUp);
    				});
    				updateVisuals();
    			}
    			function resetPalette(paletteSection) {
    				saveState(); // Save state before reset to allow undo
    				resetPaletteBackground(paletteSection, false);
    				if (lockedPalettes[paletteSection.dataset.paletteId]) {
    					delete lockedPalettes[paletteSection.dataset.paletteId];
    					paletteSection.classList.remove('locked');
    					const lockButton = paletteSection.querySelector('.cg-lock-button');
    					if (lockButton) {
    						lockButton.innerHTML = createLockIcon(false);
    					}
    					updateSinglePalette(paletteSection);
    				}
    				const paletteId = paletteSection.dataset.paletteId;
    				const paletteTypeMap = {
    					'monochromatic': 'monochromatic',
    					'dominant-with-accents': 'dominant',
    					'neutral-pop': 'neutralpop',
    					'analogous': 'analogous',
    					'complementary': 'complementary',
    					'warm-cool-split': 'warmcool',
    					'split-complementary': 'split',
    					'triadic': 'triadic',
    					'tetradic': 'tetradic'
    				};
    				const paletteType = paletteTypeMap[paletteId];
    				if (paletteType) {
    					const defaults = getPaletteDefaults(paletteType);
    					if (defaults && defaults.darkLightPrefs) {
    						darkLightPreferences[paletteType].dark = defaults.darkLightPrefs.dark;
    						darkLightPreferences[paletteType].light = defaults.darkLightPrefs.light;
    						paletteSection.querySelectorAll('.cg-swatch-dropdown-inside').forEach(dropdown => {
    							if (dropdown.paletteType === paletteType) {
    								dropdown.value = darkLightPreferences[paletteType][dropdown.colorType];
    							}
    						});
    					}
    					if (defaults && defaults.darkLightControls) {
    						darkLightAdvancedControls[paletteType] = JSON.parse(JSON.stringify(defaults.darkLightControls));
    					}
    				}
    				paletteSection.querySelectorAll('input[type="range"], input[type="checkbox"], select').forEach(control => {
    					if (control.dataset.default) {
    						if (control.type === 'checkbox') {
    							control.checked = control.dataset.default === 'dark';
    						} else {
    							control.value = control.dataset.default;
    						}
    						const event = new Event(control.type === 'checkbox' || control.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true });
    						control.dispatchEvent(event);
    					}
    				});
    				updateColorsAndDisplays();
    				saveState();
    				updatePaletteResetButtons();
    			}
    			function copyPaletteCss(paletteSection, paletteTitle) {
    				let cssString = `\n:root {\n`;
    				paletteSection.querySelectorAll('.cg-color-swatch').forEach(swatch => {
    					const id = swatch.dataset.id.replace(/_/g, '-');
    					const h = parseInt(swatch.dataset.h);
    					const s = parseInt(swatch.dataset.s);
    					const l = parseInt(swatch.dataset.l);
    					let colorValue;
    					if (displayFormat === 'CSS_RGB' || displayFormat === 'RGB') {
    						colorValue = formatColorForDisplay(h, s, l, 'CSS_RGB');
    					} else if (displayFormat === 'CSS_HSL' || displayFormat === 'HSL') {
    						colorValue = formatColorForDisplay(h, s, l, 'CSS_HSL');
    					} else {
    						colorValue = formatColorForDisplay(h, s, l, 'HEX');
    					}
    					cssString += `  --color-${id}: ${colorValue};\n`;
    				});
    				cssString += '}';
    				copyToClipboard(cssString, 'CSS copied to clipboard!');
    			}
    			async function savePalettePng(paletteSection, paletteTitle) {
    				const topRowSwatches = Array.from(paletteSection.querySelector('.cg-top-color-row').querySelectorAll('.cg-color-swatch'));
    				const bottomRowSwatches = Array.from(paletteSection.querySelector('.cg-bottom-color-row').querySelectorAll('.cg-color-swatch'));
    				const canvas = document.createElement('canvas');
    				const ctx = canvas.getContext('2d');
    				const swatchWidth = 150;
    				const swatchHeight = 120;
    				const padding = 20;
    				const textPadding = 10;
    				const hasBottomRow = bottomRowSwatches.length > 0;
    				canvas.width = (swatchWidth * topRowSwatches.length) + (padding * 2);
    				canvas.height = swatchHeight + (hasBottomRow ? swatchHeight : 0) + (padding * (hasBottomRow ? 3 : 2));
    				ctx.fillStyle = '#FFFFFF';
    				ctx.fillRect(0, 0, canvas.width, canvas.height);
    				await document.fonts.load('12px Poppins');
    				ctx.font = '600 12px Poppins, sans-serif';
    				ctx.textAlign = 'center';
    				ctx.textBaseline = 'middle';
    				topRowSwatches.forEach((swatch, index) => {
    					const x = padding + (index * swatchWidth);
    					const y = padding;
    					const h = parseInt(swatch.dataset.h);
    					const s = parseInt(swatch.dataset.s);
    					const l = parseInt(swatch.dataset.l);
    					const colorHex = hslToHex(h, s, l);
    					let formatForPng = displayFormat;
    					if (displayFormat === 'CSS_RGB') formatForPng = 'RGB';
    					if (displayFormat === 'CSS_HSL') formatForPng = 'HSL';
    					const colorValue = formatColorForDisplay(h, s, l, formatForPng);
    					ctx.fillStyle = colorHex;
    					ctx.fillRect(x, y, swatchWidth, swatchHeight);
    					ctx.fillStyle = getContrastColor(colorHex);
    					ctx.fillText(colorValue, x + swatchWidth / 2, y + swatchHeight - textPadding - 5);
    				});
    				if (hasBottomRow) {
    					const bottomY = padding * 2 + swatchHeight;
    					bottomRowSwatches.forEach((swatch, index) => {
    						const x = padding + (index * (canvas.width - padding * 2) / bottomRowSwatches.length);
    						const width = (canvas.width - padding * 2) / bottomRowSwatches.length;
    						const h = parseInt(swatch.dataset.h);
    						const s = parseInt(swatch.dataset.s);
    						const l = parseInt(swatch.dataset.l);
    						const colorHex = hslToHex(h, s, l);
    						let formatForPng = displayFormat;
    						if (displayFormat === 'CSS_RGB') formatForPng = 'RGB';
    						if (displayFormat === 'CSS_HSL') formatForPng = 'HSL';
    						const colorValue = formatColorForDisplay(h, s, l, formatForPng);
    						ctx.fillStyle = colorHex;
    						ctx.fillRect(x, bottomY, width, swatchHeight);
    						ctx.fillStyle = getContrastColor(colorHex);
    						ctx.fillText(colorValue, x + width / 2, bottomY + swatchHeight - textPadding - 5);
    					});
    				}
    				const link = document.createElement('a');
    				link.download = `${paletteTitle.toLowerCase().replace(/[\s/]/g, '-')}-palette.png`;
    				link.href = canvas.toDataURL('image/png');
    				link.click();
    			}
    			function createPaletteSection(title, description, colorData, paletteType) {
    				const section = document.createElement('div');
    				section.className = 'cg-palette-section';
    				section.dataset.paletteId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    				const titleEl = document.createElement('h3');
    				titleEl.className = 'cg-palette-title';
    				titleEl.textContent = title;
    				const descEl = document.createElement('p');
    				descEl.className = 'cg-palette-description';
    				descEl.textContent = description;
    				const pinButton = document.createElement('button');
    				pinButton.className = 'cg-pin-button';
    				pinButton.setAttribute('aria-label', `Pin ${title} palette`);
    				pinButton.innerHTML = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194.94 253.55" style="display: block; fill: currentColor; height: 16px; width: 18px;"><path d="M378.61,294.78c2.16,13.41-4.38,21.78-16,26.94-6,2.66-12.19,4.76-18.54,7.2q3,24.68,6.06,49.48c1.8,14.41,3.79,28.79,5.41,43.22.34,3.11,1.52,4.55,4.34,5.6,10.6,3.95,20.36,9.31,28.16,17.78,7.21,7.82,9.65,17,8.41,28H306.65V479q0,29,0,57.95c0,2,.5,4.46-.48,5.8-1.67,2.29-4.1,4.88-6.63,5.46-3.46.8-6.28-1.66-7.12-5.36a28.39,28.39,0,0,1-.39-5.91q0-29,0-57.95v-5.77H202.29c-2.33-16.21,4.76-27.58,17.25-35.91,6.12-4.09,13.13-6.81,19.59-10.42,1.56-.88,3.44-2.7,3.64-4.28,4-30.92,7.87-61.86,11.72-92.8a5.2,5.2,0,0,0-.24-1.28c-3.88-1.29-8-2.45-11.91-4a95.08,95.08,0,0,1-10.25-4.87c-9.92-5.37-13.62-13.85-12.06-24.84Z" transform="translate(-201.85 -294.78)"/></svg>`;
                    const header = document.createElement('div');
                    header.className = 'cg-palette-header';
                    const lockButton = document.createElement('button');
                    lockButton.className = 'cg-lock-button';
                    lockButton.setAttribute('aria-label', 'Lock palette');
                    lockButton.innerHTML = createLockIcon(false); // Default to unlocked icon
                    lockButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        handleLockClick(section);
                    });
    				const iconsWrapper = document.createElement('div');
    				iconsWrapper.className = 'cg-palette-icons';
    				iconsWrapper.appendChild(lockButton);
    				iconsWrapper.appendChild(pinButton);
    				header.appendChild(titleEl);
    				header.appendChild(iconsWrapper);
    				section.appendChild(header);
    				section.appendChild(descEl);
    				const colorRows = document.createElement('div');
    				colorRows.className = 'cg-color-rows';
    				const topRow = document.createElement('div');
    				topRow.className = 'cg-color-row cg-top-color-row';
    				colorData.topRow.forEach(colorObj => {
    					topRow.appendChild(createColorSwatch(colorObj, paletteType, false));
    				});
    				colorRows.appendChild(topRow);
    				const proportionBar = createCompactProportionBar(paletteType, colorData);
    				if (proportionBar) {
    					colorRows.appendChild(proportionBar);
    				}
    				const bottomRow = document.createElement('div');
    				bottomRow.className = 'cg-color-row cg-bottom-color-row';
    				colorData.bottomRow.forEach(colorObj => {
    					bottomRow.appendChild(createColorSwatch(colorObj, paletteType, true));
    				});
    				colorRows.appendChild(bottomRow);
    				const darkLightControls = createDarkLightAdvancedControls(paletteType);
    				colorRows.appendChild(darkLightControls);
    				section.appendChild(colorRows);
    				const paletteControls = createPaletteControls(paletteType);
    				if (paletteControls) {
    					section.appendChild(paletteControls);
    				}
    				const actionsContainer = document.createElement('div');
    				actionsContainer.className = 'cg-palette-actions';
    				const resetButton = document.createElement('button');
    				resetButton.className = 'cg-action-button reset-button';
    				resetButton.innerHTML = 'Reset ⟲';
    				resetButton.addEventListener('click', () => {
    					if (!resetButton.disabled) {
    						resetPalette(section);
    					}
    				});
    				const paletteTypeMap = {
    					'monochromatic': 'monochromatic',
    					'dominant-with-accents': 'dominant',
    					'neutral-pop': 'neutralpop',
    					'analogous': 'analogous',
    					'complementary': 'complementary',
    					'warm-cool-split': 'warmcool',
    					'split-complementary': 'split',
    					'triadic': 'triadic',
    					'tetradic': 'tetradic'
    				};
    				const paletteId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    				const mappedPaletteType = paletteTypeMap[paletteId];
    				const hasChanged = checkPaletteChanged(mappedPaletteType);
    				resetButton.disabled = !hasChanged;
    				if (!hasChanged) {
    					resetButton.style.opacity = '0.6';
    					resetButton.style.cursor = 'not-allowed';
    				}
    				const copyCssButton = document.createElement('button');
    				copyCssButton.className = 'cg-action-button';
    				copyCssButton.innerHTML = 'Copy CSS ⧉';
    				copyCssButton.addEventListener('click', () => copyPaletteCss(section, title));
    				const savePngButton = document.createElement('button');
    				savePngButton.className = 'cg-action-button';
    				savePngButton.innerHTML = 'Save PNG ↓';
    				savePngButton.addEventListener('click', () => savePalettePng(section, title));
    				actionsContainer.appendChild(resetButton);
    				actionsContainer.appendChild(copyCssButton);
    				actionsContainer.appendChild(savePngButton);
    				section.appendChild(actionsContainer);
    				return section;
    			}
    			function copyToClipboard(text, message = 'Color copied to clipboard!') {
    				navigator.clipboard.writeText(text).then(() => {
    					const notification = document.getElementById('cgCopyNotification');
    					const helpLink = document.getElementById('helpLink');
    					if (helpLink) {
    						helpLink.style.opacity = '0';
    						helpLink.style.pointerEvents = 'none';
    					}
    					notification.textContent = message;
    					notification.classList.add('show');
    					setTimeout(() => {
    						notification.classList.remove('show');
    						setTimeout(() => {
    							if (helpLink) {
    								helpLink.style.opacity = '1';
    								helpLink.style.pointerEvents = 'auto';
    							}
    						}, 300); // Match the transition duration
    					}, 1500); // Show for 1.5 seconds
    				});
    			}
    			function generateColorPalettes() {
    				const container = document.getElementById('cgPalettesContainer');
    				const currentlyPinned = Array.from(container.querySelectorAll('.cg-palette-section.pinned'));
    				const pinnedIds = currentlyPinned.map(p => p.dataset.paletteId);
    				container.innerHTML = '';
    				const palettes = [
    					{ title: 'Monochromatic', desc: 'Single hue with varied brightness and saturation', colors: generateMonochromatic(), type: 'monochromatic' },
    					{ title: 'Dominant with Accents', desc: 'Main color with secondary and accent pop', colors: generateDominantAccent(), type: 'dominant' },
    					{ title: 'Neutral + Pop', desc: 'Muted neutrals paired with a vibrant accent color', colors: generateNeutralPop(), type: 'neutralpop' },
    					{ title: 'Analogous', desc: `Adjacent colors within ${analogousRange}° for harmony`, colors: generateAnalogous(), type: 'analogous' },
    					{ title: 'Complementary', desc: 'Opposite colors for maximum contrast and impact', colors: generateComplementary(), type: 'complementary' },
    					{ title: 'Warm/Cool Split', desc: 'Contrast between warm and cool tones', colors: generateWarmCoolSplit(), type: 'warmcool' },
    					{ title: 'Split Complementary', desc: 'Base color with two adjacent complement colors', colors: generateSplitComplementary(), type: 'split' },
    					{ title: 'Triadic', desc: 'Three evenly spaced colors for vibrant balance', colors: generateTriadic(), type: 'triadic' },
    					{ title: 'Tetradic', desc: 'Four colors in two complementary pairs for depth', colors: generateTetradic(), type: 'tetradic' }
    				];
    				pinnedPaletteElements = [];
    				palettes.forEach(palette => {
    					const section = createPaletteSection(palette.title, palette.desc, palette.colors, palette.type);
    					container.appendChild(section);
    					if (pinnedIds.includes(section.dataset.paletteId)) {
    						section.classList.add('pinned');
    						pinnedPaletteElements.push(section);
    					}
    				});
    					const allPalettes = document.querySelectorAll('.cg-palette-section');
    					allPalettes.forEach(p => {
    						p.style.order = ''; // Reset order for all
    					});
    					pinnedPaletteElements.forEach((p, index) => {
    						p.style.order = -(pinnedPaletteElements.length - index); // Set order for pinned ones
    					});
    			}
    			function updateExistingPalettes() {
    				const palettes = [
    					{ title: 'Monochromatic', colors: generateMonochromatic(), type: 'monochromatic' },
    					{ title: 'Dominant with Accents', colors: generateDominantAccent(), type: 'dominant' },
    					{ title: 'Neutral + Pop', colors: generateNeutralPop(), type: 'neutralpop' },
    					{ title: 'Analogous', colors: generateAnalogous(), type: 'analogous' },
    					{ title: 'Complementary', colors: generateComplementary(), type: 'complementary' },
    					{ title: 'Warm/Cool Split', colors: generateWarmCoolSplit(), type: 'warmcool' },
    					{ title: 'Split Complementary', colors: generateSplitComplementary(), type: 'split' },
    					{ title: 'Triadic', colors: generateTriadic(), type: 'triadic' },
    					{ title: 'Tetradic', colors: generateTetradic(), type: 'tetradic' }
    				];
    				palettes.forEach(paletteData => {
    					const sectionId = paletteData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    					const section = document.querySelector(`[data-palette-id="${sectionId}"]`);
    					if (!section) return;
    					if (lockedPalettes[sectionId]) {
    						const locked = lockedPalettes[sectionId];
    						const tempHue = selectedHue;
    						const tempSat = baseSaturation;
    						const tempBright = baseBrightness;
    						selectedHue = locked.hue;
    						baseSaturation = locked.saturation;
    						baseBrightness = locked.brightness;
    						const lockedColors = getPaletteGenerator(paletteData.type)();
    						selectedHue = tempHue;
    						baseSaturation = tempSat;
    						baseBrightness = tempBright;
    						updatePaletteDisplay(section, lockedColors, paletteData.type);
    						return; // Skip the normal update
    					}
    					updatePaletteDisplay(section, paletteData.colors, paletteData.type);
    				});
    			}
                function updatePaletteDisplay(section, colorData, paletteType) {
                    const colorRows = section.querySelector('.cg-color-rows');
                    const topRowEl = colorRows.querySelector('.cg-top-color-row');
                    const bottomRowEl = colorRows.querySelector('.cg-bottom-color-row');
                    if (!topRowEl || !bottomRowEl) {
                        console.error(`Could not find color rows for palette: ${paletteType}`);
                        return;
                    }
                    topRowEl.innerHTML = '';
                    colorData.topRow.forEach(colorObj => {
                        topRowEl.appendChild(createColorSwatch(colorObj, paletteType, false));
                    });
                    const bottomSwatchContainers = bottomRowEl.querySelectorAll('.cg-color-swatch-container');
                    colorData.bottomRow.forEach((colorObj, i) => {
                        if (bottomSwatchContainers[i]) {
                            const swatch = bottomSwatchContainers[i].querySelector('.cg-color-swatch');
                            swatch.style.backgroundColor = colorObj.hex;
                            const hsl = hexToHsl(colorObj.hex);
                            swatch.dataset.h = hsl.h;
                            swatch.dataset.s = hsl.s;
                            swatch.dataset.l = hsl.l;
                            swatch.dataset.id = colorObj.id;
                            swatch.querySelector('.cg-color-label').textContent = colorObj.label;
                        }
                    });
                    let existingProportionBar = colorRows.querySelector('.cg-proportion-bar-container');
                    const newProportionBar = createCompactProportionBar(paletteType, colorData);
                    if (existingProportionBar && newProportionBar) {
                        existingProportionBar.parentElement.replaceChild(newProportionBar, existingProportionBar);
                    } else if (!existingProportionBar && newProportionBar) {
                        const lastColorRow = colorRows.querySelector('.cg-bottom-color-row');
                        if (lastColorRow) {
                             colorRows.insertBefore(newProportionBar, lastColorRow);
                        }
                    }
                    if (paletteType === 'analogous') {
                        section.querySelector('.cg-palette-description').textContent = 'Adjacent colors within ' + analogousRange + '° for harmony';
                    }
                    updateAllColorText();
                }
                function updateSinglePalette(paletteSection) {
                    const paletteId = paletteSection.dataset.paletteId;
                    const paletteMap = {
                        'monochromatic': { generator: generateMonochromatic, type: 'monochromatic' },
                        'dominant-with-accents': { generator: generateDominantAccent, type: 'dominant' },
                        'neutral-pop': { generator: generateNeutralPop, type: 'neutralpop' },
                        'analogous': { generator: generateAnalogous, type: 'analogous' },
                        'complementary': { generator: generateComplementary, type: 'complementary' },
                        'warm-cool-split': { generator: generateWarmCoolSplit, type: 'warmcool' },
                        'split-complementary': { generator: generateSplitComplementary, type: 'split' },
                        'triadic': { generator: generateTriadic, type: 'triadic' },
                        'tetradic': { generator: generateTetradic, type: 'tetradic' }
                    };
                    const paletteInfo = paletteMap[paletteId];
                    if (paletteInfo) {
                        const newColors = paletteInfo.generator(); // Generate colors based on current main controls
                        updatePaletteDisplay(paletteSection, newColors, paletteInfo.type);
                    }
                }
    			function updateAllColorText() {
    				const hexInput = document.getElementById('hexInput');
    				const mainHex = createTheoryColor(selectedHue, baseSaturation, baseBrightness);
    				const mainHsl = hexToHsl(mainHex);
    				let mainDisplayFormat = displayFormat;
    				if (displayFormat === 'CSS_RGB') mainDisplayFormat = 'RGB';
    				if (displayFormat === 'CSS_HSL') mainDisplayFormat = 'HSL';
    				hexInput.value = formatColorForDisplay(mainHsl.h, mainHsl.s, mainHsl.l, mainDisplayFormat);
    				document.querySelectorAll('.cg-color-swatch').forEach(swatch => {
    					const h = swatch.dataset.h;
    					const s = swatch.dataset.s;
    					const l = swatch.dataset.l;
    					if(h && s && l) {
    						const copyValue = formatColorForDisplay(parseInt(h), parseInt(s), parseInt(l), displayFormat);
    						swatch.dataset.colorValue = copyValue;
    					}
    				});
    			}
    			function updateColorsAndDisplays() {
    				const selectedColorHex = createTheoryColor(selectedHue, baseSaturation, baseBrightness);
    				document.getElementById('selectedColorDisplay').style.backgroundColor = selectedColorHex;
    				updateExistingPalettes();
    				updateAllColorText();
    				updatePaletteResetButtons(); // ADD THIS
    			}
    			function initializeAndGeneratePalettes() {
    				generateColorPalettes();
    				if (window.location.hash) {
    					try {
    						const encodedState = window.location.hash.substring(1);
    						let decodedState = decompressState(encodedState);
    						if (!decodedState) {
    							decodedState = JSON.parse(atob(encodedState));
    						}
    						applyState(decodedState);
    					} catch (e) {
    						console.error("Failed to load state from URL:", e);
    						saveState();
    					}
    				}
    				else {
    					const savedState = loadFromLocalStorage();
    					if (savedState) {
    						applyState(savedState);
    						Object.keys(lockedPalettes).forEach(paletteId => {
    							const section = document.querySelector(`[data-palette-id="${paletteId}"]`);
    							if (section) {
    								section.classList.add('locked');
    								const lockButton = section.querySelector('.cg-lock-button');
    								if (lockButton) {
    									lockButton.innerHTML = createLockIcon(true);
    								}
    							}
    						});
    						history = [getCurrentState()];
    						redoStack = [];
    						console.log('Restored previous session from localStorage');
    					} else {
    						saveState();
    					}
    				}
    				updateColorsAndDisplays();
    			}
    			function updateStateFromHsl(hsl, updateHueSlider = true) {
    				const oldHue = selectedHue;
    				selectedHue = rgbToRybHue(hsl.h);
    				const oldTemp = getColorTemperature(oldHue);
    				const newTemp = getColorTemperature(selectedHue);
    				if (oldTemp !== newTemp) {
    					updateWarmCoolDropdowns();
    				}
    				baseSaturation = hsl.s;
    				baseBrightness = hsl.l;
    				if (updateHueSlider) {
    					document.getElementById('hueSlider').value = selectedHue;
    				}
    				document.getElementById('baseSaturation').value = baseSaturation;
    				document.getElementById('saturationValue').textContent = baseSaturation + '%';
    				document.getElementById('baseBrightness').value = baseBrightness;
    				document.getElementById('brightnessValue').textContent = baseBrightness + '%';
    				updateColorsAndDisplays();
    				saveState();
    			}
    			function handleSliderDoubleClick(e) {
    				const slider = e.target;
    				if (slider.type === 'range' && slider.dataset.default) {
    					slider.value = slider.dataset.default;
    					slider.dispatchEvent(new Event('input', { bubbles: true }));
    					saveState(); // Save state after double-click reset
    				}
    			}
    			function updateUIFromState() {
    				const hueSlider = document.getElementById('hueSlider');
    				const saturationSlider = document.getElementById('baseSaturation');
    				const brightnessSlider = document.getElementById('baseBrightness');
    				const colorFormatDropdown = document.getElementById('colorFormatDropdown');
    				const colorGenerator = document.querySelector('.color-generator');
    				const advancedControlsBtn = document.getElementById('advancedControlsBtn');
    				hueSlider.value = selectedHue;
    				saturationSlider.value = baseSaturation;
    				brightnessSlider.value = baseBrightness;
    				colorFormatDropdown.value = displayFormat;
    				document.getElementById('saturationValue').textContent = baseSaturation + '%';
    				document.getElementById('brightnessValue').textContent = baseBrightness + '%';
    				colorGenerator.classList.toggle('advanced-controls-active', advancedControlsActive);
    				const starEl = advancedControlsBtn.querySelector('.star');
    				if (starEl) {
    					starEl.textContent = advancedControlsActive ? '★' : '☆';
    				}
    				document.querySelectorAll('.cg-palette-section').forEach(section => {
    					const id = section.dataset.paletteId;
    					const controls = section.querySelector('.cg-palette-controls');
    					const paletteTypeMap = {
    						'monochromatic': 'monochromatic',
    						'dominant-with-accents': 'dominant',
    						'neutral-pop': 'neutralpop',
    						'analogous': 'analogous',
    						'complementary': 'complementary',
    						'warm-cool-split': 'warmcool',
    						'split-complementary': 'split',
    						'triadic': 'triadic',
    						'tetradic': 'tetradic'
    					};
    					const paletteType = paletteTypeMap[id];
    					if (!paletteType) return;
    					const swatchDropdowns = section.querySelectorAll('.cg-swatch-dropdown-inside');
    					swatchDropdowns.forEach(dd => {
    						const colorType = dd.colorType; // 'dark' or 'light'
    						if (darkLightPreferences[paletteType] && darkLightPreferences[paletteType][colorType]) {
    							dd.value = darkLightPreferences[paletteType][colorType];
    						}
    					});
    					if (!controls) return;
    					const updateSlider = (container, value, textTransform) => {
    						const slider = container.querySelector('.cg-palette-slider');
    						if (slider) {
    							slider.value = value;
    							const textDisplay = container.querySelector('span');
    							if (textDisplay && textTransform) {
    								textDisplay.textContent = textTransform(value);
    							}
    						}
    					};
    					const updateDropdown = (container, value) => {
    						const dropdown = container.querySelector('.cg-palette-dropdown');
    						if (dropdown) {
    							dropdown.value = value;
    						}
    					};
    					if (paletteType === 'monochromatic') {
    						const rows = controls.querySelectorAll('.cg-palette-controls-row');
    						updateSlider(rows[0].children[0], monochromaticSpread, v => `${v}%`);
    						updateSlider(rows[0].children[1], accentHueShift, v => `${v >= 0 ? '+' : ''}${v}°`);
    						updateSlider(rows[1].children[0], accentBrightnessShift, v => `${v >= 0 ? '+' : ''}${v}`);
    						updateSlider(rows[1].children[1], accentSaturationShift, v => `${v >= 0 ? '+' : ''}${v}%`);
    					} else if (paletteType === 'dominant') {
    						const row = controls.querySelector('.cg-palette-controls-row');
    						updateSlider(row.children[0], accentIntensity, v => `${v}%`);
    						updateDropdown(row.children[1], dominantRelationship);
    						const balanceRow = controls.querySelectorAll('.cg-palette-controls-row')[1];
    						const balanceSlider = balanceRow.querySelector('.cg-palette-slider');
    						const balanceValue = balanceRow.querySelector('span');
    						if(balanceSlider) balanceSlider.value = dominantDistribution;
    						if(balanceValue) {
    						   if (dominantDistribution <= 40) balanceValue.textContent = 'Equal';
    						   else if (dominantDistribution >= 70) balanceValue.textContent = 'Heavy';
    						   else if (dominantDistribution >= 59 && dominantDistribution <= 61) balanceValue.textContent = 'Classic';
    						   else balanceValue.textContent = dominantDistribution + '%';
    						}
    					} else if (paletteType === 'neutralpop') {
    						const rows = controls.querySelectorAll('.cg-palette-controls-row');
    						updateSlider(rows[0].children[0], neutralSpread, v => `${v}%`); // <-- ADDED for Spread
    						updateDropdown(rows[0].children[1], neutralStrategy);
    						updateSlider(rows[1].children[0], neutralDepth, v => `${v}%`);
    						updateSlider(rows[1].children[1], neutralBrightnessShift, v => `${v >= 0 ? '+' : ''}${v}`);
    					} else if (paletteType === 'analogous') {
    						updateSlider(controls.querySelector('.cg-palette-controls-row'), analogousRange, v => `${v}°`);
    						const bottomRow = controls.querySelectorAll('.cg-palette-controls-row')[1];
    						updateDropdown(bottomRow.children[0], analogousColorCount);
    						updateDropdown(bottomRow.children[1], analogousDistribution);
    					} else if (paletteType === 'complementary') {
    						const rows = controls.querySelectorAll('.cg-palette-controls-row');
    						updateSlider(rows[0].children[0], complementaryBalance, v => `${v}/${100-v}`);
    						updateSlider(rows[1].querySelector('.cg-range-with-label'), complementaryTension, v => `${v >= 0 ? '+' : ''}${v}°`);
    						const toggle = rows[1].querySelector('.cg-bridge-toggle input');
    						if(toggle) {
    							toggle.checked = complementaryBrightnessMode === 'dark';
    							const brightModeLabel = toggle.closest('.cg-bridge-toggle').querySelector('.cg-bridge-label');
    							const sunIcon = brightModeLabel.querySelector('.sun-icon-wrapper');
    							const moonIcon = brightModeLabel.querySelector('.moon-icon-wrapper');
    							if (toggle.checked) {
    								sunIcon.style.opacity = '0.4';
    								moonIcon.style.opacity = '1';
    							} else {
    								sunIcon.style.opacity = '1';
    								moonIcon.style.opacity = '0.4';
    							}
    						}
    					} else if (paletteType === 'warmcool') {
    						const rows = controls.querySelectorAll('.cg-palette-controls-row');
    						updateDropdown(rows[0].children[0], warmCoolMode);
    						updateDropdown(rows[0].children[1], warmCoolContrast);
    						updateSlider(rows[1].children[0], temperatureShift, v => `${v >= 0 ? '+' : ''}${v}°`);
    					} else if (paletteType === 'split') {
    						const rows = controls.querySelectorAll('.cg-palette-controls-row');
    						updateSlider(rows[0].children[0], splitAngle, v => `${v}°`);
    						updateDropdown(rows[1].children[0], splitSatDistribution);
    						updateDropdown(rows[1].children[1], splitEmphasis);
    					} else if (paletteType === 'triadic') {
    						 const rows = controls.querySelectorAll('.cg-palette-controls-row');
    						updateDropdown(rows[0].children[0], triadicBalanceMode);
    						updateDropdown(rows[1].children[0], triadicVibrance);
    					} else if (paletteType === 'tetradic') {
    						const rows = controls.querySelectorAll('.cg-palette-controls-row');
    						updateDropdown(rows[0].children[0], tetradicPairingMode);
    						updateDropdown(rows[0].children[1], tetradicSaturationStrategy);
    						updateSlider(rows[1].children[0], tetradicDominance, v => `${v}%`);
    					}
    					const dlControls = section.querySelector('.cg-dark-light-controls');
    					if (dlControls && darkLightAdvancedControls[paletteType]) {
    						const advState = darkLightAdvancedControls[paletteType];
    						dlControls.querySelector('[data-type="darkSat"]').value = advState.darkSat;
    						dlControls.querySelector('[data-type="darkSat"]').nextElementSibling.textContent = `${advState.darkSat}%`;
    						dlControls.querySelector('[data-type="lightSat"]').value = advState.lightSat;
    						dlControls.querySelector('[data-type="lightSat"]').nextElementSibling.textContent = `${advState.lightSat}%`;
    						const darkBrightSlider = dlControls.querySelector('[data-type="darkBright"]');
    						const lightBrightSlider = dlControls.querySelector('[data-type="lightBright"]');
    						const darkBrightVal = dlControls.querySelector('[data-type="darkBrightVal"]');
    						const lightBrightVal = dlControls.querySelector('[data-type="lightBrightVal"]');
    						darkBrightSlider.value = advState.darkBright;
    						lightBrightSlider.value = advState.lightBright;
    						darkBrightVal.textContent = `${advState.darkBright}%`;
    						lightBrightVal.textContent = `+${advState.lightBright}%`;
    						const trackLeft = dlControls.querySelector('.cg-brightness-track-left');
    						const trackRight = dlControls.querySelector('.cg-brightness-track-right');
    						const leftPercentage = ((parseInt(darkBrightSlider.max) - advState.darkBright) / (parseInt(darkBrightSlider.max) - parseInt(darkBrightSlider.min))) * 50;
    						const rightPercentage = ((advState.lightBright - parseInt(lightBrightSlider.min)) / (parseInt(lightBrightSlider.max) - parseInt(lightBrightSlider.min))) * 50;
    						trackLeft.style.width = leftPercentage + '%';
    						trackRight.style.width = rightPercentage + '%';
    					}
    				});
    			}
    			function checkForChanges() {
    				const resetBtn = document.getElementById('resetAllBtn');
    				let hasChanged = false;
    				if (Object.keys(paletteBackgrounds).length > 0) {
    					hasChanged = true;
    				}
    				if (Object.keys(lockedPalettes).length > 0) {
    					hasChanged = true;
    				}				
    				Object.keys(darkLightPreferences).forEach(paletteType => {
    					const defaults = getPaletteDefaults(paletteType);
    					if (defaults && defaults.darkLightPrefs) {
    						if (darkLightPreferences[paletteType].dark !== defaults.darkLightPrefs.dark ||
    							darkLightPreferences[paletteType].light !== defaults.darkLightPrefs.light) {
    							hasChanged = true;
    						}
    					}
    				});
    				const controls = document.querySelectorAll('.cg-controls-section [data-default], .cg-palette-section [data-default]');
    				controls.forEach(control => {
    					if (control.id === 'hueSlider' || control.id === 'colorFormatDropdown') {
    						return; 
    					}
    					const defaultValue = control.dataset.default;
    					let currentValue;
    					if (control.type === 'checkbox') {
    						currentValue = control.checked ? 'dark' : 'light';
    					} else {
    						currentValue = control.value;
    					}
    					if (currentValue != defaultValue) {
    						hasChanged = true;
    					}
    				});
    				resetBtn.disabled = !hasChanged;
    			}
    			function resetAll() {
    				isApplyingState = true; 
    				saveState(); 
    				document.querySelectorAll('.cg-palette-section').forEach(section => {
    					resetPaletteBackground(section, false); // Don't save state individually
    				});
    				paletteBackgrounds = {};
    				document.querySelectorAll('.cg-palette-section.locked').forEach(section => {
    					const paletteId = section.dataset.paletteId;
    					delete lockedPalettes[paletteId];
    					section.classList.remove('locked');
    					const lockButton = section.querySelector('.cg-lock-button');
    					if (lockButton) {
    						lockButton.innerHTML = createLockIcon(false);
    					}
    				});
    				lockedPalettes = {}; // Clear the entire object				
    				Object.keys(darkLightPreferences).forEach(paletteType => {
    					const defaults = getPaletteDefaults(paletteType);
    					if (defaults && defaults.darkLightPrefs) {
    						darkLightPreferences[paletteType].dark = defaults.darkLightPrefs.dark;
    						darkLightPreferences[paletteType].light = defaults.darkLightPrefs.light;
    					}
    				});
    				Object.keys(darkLightAdvancedControls).forEach(paletteType => {
    					const defaults = getPaletteDefaults(paletteType);
    					if (defaults && defaults.darkLightControls) {
    						darkLightAdvancedControls[paletteType] = JSON.parse(JSON.stringify(defaults.darkLightControls));
    					}
    				});
    				document.querySelectorAll('.cg-swatch-dropdown-inside').forEach(dropdown => {
    					if (dropdown.paletteType && dropdown.colorType) {
    						dropdown.value = darkLightPreferences[dropdown.paletteType][dropdown.colorType];
    					}
    				});
    				const controlsToReset = document.querySelectorAll('[data-default]:not(#hueSlider):not(#colorFormatDropdown)');
    				controlsToReset.forEach(control => {
    					const defaultValue = control.dataset.default;
    					if (control.type === 'checkbox') {
    						control.checked = defaultValue === 'dark';
    					} else {
    						control.value = defaultValue;
    					}
    					control.dispatchEvent(new Event('input', { bubbles: true }));
    					control.dispatchEvent(new Event('change', { bubbles: true }));
    				});
    				isApplyingState = false;
    				updateColorsAndDisplays();
    				saveState(); 
    			}
    			let contextMenu = null;
    			let setValuePopup = null;
    			let currentContextTarget = null;
    			function createContextMenu() {
    				const menu = document.createElement('div');
    				menu.className = 'context-menu';
    				APP_CONTAINER.appendChild(menu);
    				return menu;
    			}
    			function createSetValuePopup() {
    				const popup = document.createElement('div');
    				popup.className = 'set-value-popup';
    				popup.style.display = 'none';
    				const header = document.createElement('div');
    				header.className = 'set-value-popup-header';
    				const input = document.createElement('input');
    				input.className = 'set-value-input';
    				input.type = 'text';
    				popup.appendChild(header);
    				popup.appendChild(input);
    				APP_CONTAINER.appendChild(popup);
    				input.addEventListener('input', (e) => {
    					const value = e.target.value;
    					const filtered = value.replace(/[^-0-9.]/g, '');
    					if (filtered !== value) {
    						e.target.value = filtered;
    					}
    				});
    				input.addEventListener('keydown', (e) => {
    					if (e.key === 'Enter') {
    						applySetValue();
    					} else if (e.key === 'Escape') {
    						hideSetValuePopup();
    					}
    				});
    				return { popup, header, input };
    			}
    			function applySetValue() {
    				if (!currentContextTarget || !setValuePopup) return;
    				const value = parseFloat(setValuePopup.input.value);
    				if (isNaN(value)) {
    					hideSetValuePopup();
    					return;
    				}
    				const min = parseFloat(currentContextTarget.min);
    				const max = parseFloat(currentContextTarget.max);
    				const clampedValue = Math.max(min, Math.min(max, value));
    				currentContextTarget.value = clampedValue;
    				currentContextTarget.dispatchEvent(new Event('input', { bubbles: true }));
    				currentContextTarget.dispatchEvent(new Event('change', { bubbles: true }));
    				hideSetValuePopup();
    			}
    			function hideSetValuePopup() {
    				if (setValuePopup) {
    					setValuePopup.popup.style.display = 'none';
    				}
    				currentContextTarget = null;
    			}
    			function showSetValuePopup(target, x, y) {
    				currentContextTarget = target;
    				if (!setValuePopup) {
    					console.error('setValuePopup not initialized');
    					return;
    				}
    				const min = target.min;
    				const max = target.max;
    				const current = target.value;
    				setValuePopup.header.textContent = `Range: ${min} to ${max}`;
    				setValuePopup.input.value = current;
    				setValuePopup.popup.style.display = 'block';
    				setValuePopup.popup.style.left = x + 'px';
    				setValuePopup.popup.style.top = y + 'px';
    				setValuePopup.popup.style.zIndex = '10001';
    				setTimeout(() => {
    					const rect = setValuePopup.popup.getBoundingClientRect();
    					if (rect.right > window.innerWidth) {
    						setValuePopup.popup.style.left = (window.innerWidth - rect.width - 10) + 'px';
    					}
    					if (rect.bottom > window.innerHeight) {
    						setValuePopup.popup.style.top = (window.innerHeight - rect.height - 10) + 'px';
    					}
    				}, 0);
    				setValuePopup.input.select();
    				setValuePopup.input.focus();
    			}
    			function getContextMenuItems(target, clientX, clientY) {
    				const items = [];
    				items.push({
    					label: 'Undo',
    					shortcut: isTouchDevice ? undefined : 'Ctrl+Z',
    					enabled: history.length > 1,
    					action: () => undo()
    				});
    				items.push({
    					label: 'Redo',
    					shortcut: isTouchDevice ? undefined : 'Ctrl+Y',
    					enabled: redoStack.length > 0,
    					action: () => redo()
    				});
    				const isSlider = target.type === 'range' && (target.classList.contains('cg-palette-slider') || target.classList.contains('cg-slider') || target.classList.contains('cg-dl-slider'));
    				const isPaletteDropdown = target.tagName === 'SELECT' && target.classList.contains('cg-palette-dropdown');
    				const isDarkLightDropdown = target.classList.contains('cg-swatch-dropdown-inside');
    				const isSwitch = target.type === 'checkbox';
    				const isColorSwatch = target.classList.contains('cg-color-swatch') || 
    									  (target.classList.contains('cg-color-label') && target.closest('.cg-color-swatch'));
    				const isButton = target.classList.contains('cg-action-button') || target.classList.contains('cg-main-action-btn');
    				const isPinButton = target.classList.contains('cg-pin-button');
    				const isLockButton = target.classList.contains('cg-lock-button'); // Add lock button check
    				const isHexInput = target.classList.contains('cg-hex-input');
    				const isFormatDropdown = target.id === 'colorFormatDropdown';
    				const paletteSection = target.closest('.cg-palette-section');
    				const treatedAsEmptySpace = isButton || isPinButton || isLockButton || isHexInput || isFormatDropdown;
    				const isInteractive = (isSlider || isPaletteDropdown || isDarkLightDropdown || isSwitch || isColorSwatch) && !treatedAsEmptySpace;
    				let hasMoreItems = false;
    				if (isSlider || isPaletteDropdown || isDarkLightDropdown || isSwitch || isColorSwatch || !isInteractive || treatedAsEmptySpace) {
    					hasMoreItems = true;
    				}
    				if (hasMoreItems) {
    					items.push({ separator: true });
    				}
    				if (isSlider) {
    					items.push({
    						label: 'Set value',
    						action: () => showSetValuePopup(target, clientX, clientY)
    					});
    					items.push({
    						label: 'Copy value',
    						action: () => {
    							const value = target.value;
    							copyToClipboard(value, 'Value copied to clipboard!');
    						}
    					});
    					items.push({ separator: true });
    					const hasDefault = target.dataset.default !== undefined;
    					const isAtDefault = hasDefault && target.value === target.dataset.default;
    					items.push({
    						label: 'Reset',
    						enabled: hasDefault && !isAtDefault,
    						action: () => {
    							target.value = target.dataset.default;
    							target.dispatchEvent(new Event('input', { bubbles: true }));
    							target.dispatchEvent(new Event('change', { bubbles: true }));
    						}
    					});
    				}
    				else if (isPaletteDropdown || isDarkLightDropdown || isSwitch) {
    					const hasDefault = target.dataset.default !== undefined || isDarkLightDropdown;
    					let isAtDefault = false;
    					if (isDarkLightDropdown) {
    						isAtDefault = target.value === 'recommended';
    					} else if (isSwitch) {
    						isAtDefault = hasDefault && ((target.checked && target.dataset.default === 'dark') || 
    													 (!target.checked && target.dataset.default === 'light'));
    					} else {
    						isAtDefault = hasDefault && target.value === target.dataset.default;
    					}
    					items.push({
    						label: 'Reset',
    						enabled: !isAtDefault,
    						action: () => {
    							if (isDarkLightDropdown) {
    								target.value = 'recommended';
    								target.dispatchEvent(new Event('change', { bubbles: true }));
    							} else if (isSwitch) {
    								target.checked = target.dataset.default === 'dark';
    								target.dispatchEvent(new Event('change', { bubbles: true }));
    							} else {
    								target.value = target.dataset.default;
    								target.dispatchEvent(new Event('change', { bubbles: true }));
    							}
    						}
    					});
    				}
    				else if (isColorSwatch) {
    					const swatch = target.classList.contains('cg-color-swatch') ? 
    								   target : target.closest('.cg-color-swatch');
    					const colorValue = swatch.dataset.colorValue;
    					const isDarkLight = swatch.dataset.id === 'dark' || swatch.dataset.id === 'light';
    					const hasDropdownInside = swatch.querySelector('.cg-swatch-dropdown-inside');
    					items.push({
    						label: 'Copy color code',
    						action: () => copyToClipboard(colorValue)
    					});
    					if (isDarkLight && paletteSection) {
    						const h = parseInt(swatch.dataset.h);
    						const s = parseInt(swatch.dataset.s);
    						const l = parseInt(swatch.dataset.l);
    						const hexColor = hslToHex(h, s, l);
    						items.push({
    							label: 'Set as palette background',
    							action: () => {
    								setPaletteBackground(paletteSection, hexColor);
    							}
    						});
    					}
    					if (!isDarkLight && !hasDropdownInside) {
    						items.push({
    							label: 'Set as main color',
    							action: () => {
    								const h = parseInt(swatch.dataset.h);
    								const s = parseInt(swatch.dataset.s);
    								const l = parseInt(swatch.dataset.l);
    								const rybHue = rgbToRybHue(h);
    								selectedHue = rybHue;
    								baseSaturation = s;
    								baseBrightness = l;
    								document.getElementById('hueSlider').value = selectedHue;
    								document.getElementById('baseSaturation').value = baseSaturation;
    								document.getElementById('saturationValue').textContent = baseSaturation + '%';
    								document.getElementById('baseBrightness').value = baseBrightness;
    								document.getElementById('brightnessValue').textContent = baseBrightness + '%';
    								updateColorsAndDisplays();
    								saveState();
    							}
    						});
    					}
    				}
    				else if (!isInteractive || treatedAsEmptySpace) {
    					items.push({
    						label: 'Copy share link',
    						action: () => {
    							const state = getCurrentState();
    							const jsonState = JSON.stringify(state);
    							const encodedState = btoa(jsonState);
    							const url = SHARE_BASE_URL + '#' + encodedState;
    							copyToClipboard(url, 'Share link copied!');
    						}
    					});
    					items.push({
    						label: advancedControlsActive ? 'Hide pro controls' : 'Show pro controls',
    						action: () => {
    							advancedControlsActive = !advancedControlsActive;
    							document.querySelector('.color-generator').classList.toggle('advanced-controls-active', advancedControlsActive);
    							const starEl = document.getElementById('advancedControlsBtn').querySelector('.star');
    							if (starEl) {
    								starEl.textContent = advancedControlsActive ? '★' : '☆';
    							}
    						}
    					});
    					items.push({ separator: true });
    					if (paletteSection) {
    						const paletteId = paletteSection.dataset.paletteId;
    						const paletteTypeMap = {
    							'monochromatic': 'monochromatic',
    							'dominant-with-accents': 'dominant',
    							'neutral-pop': 'neutralpop',
    							'analogous': 'analogous',
    							'complementary': 'complementary',
    							'warm-cool-split': 'warmcool',
    							'split-complementary': 'split',
    							'triadic': 'triadic',
    							'tetradic': 'tetradic'
    						};
    						const paletteType = paletteTypeMap[paletteId];
    						const paletteHasChanged = checkPaletteChanged(paletteType);
    						items.push({
    							label: 'Reset palette',
    							enabled: paletteHasChanged,
    							action: () => resetPalette(paletteSection)
    						});
    					}
    					if (paletteSection) {
    						const hasCustomBg = paletteSection.classList.contains('custom-bg');
    						items.push({
    							label: 'Reset background',
    							enabled: hasCustomBg,
    							action: () => resetPaletteBackground(paletteSection)
    						});
    					}					
    					items.push({
    						label: 'Reset all',
    						enabled: !document.getElementById('resetAllBtn').disabled,
    						action: () => resetAll()
    					});
    					if (paletteSection) {
    						items.push({ separator: true });
    						const isPinned = paletteSection.classList.contains('pinned');
    						items.push({
    							label: isPinned ? 'Unpin palette' : 'Pin palette',
    							action: () => handlePinClick(paletteSection)
    						});
    						const isLocked = paletteSection.classList.contains('locked');
    						items.push({
    							label: isLocked ? 'Unlock palette' : 'Lock palette',
    							action: () => handleLockClick(paletteSection)
    						});
    					}
    				}
    				return items;
    			}
    			function showContextMenu(e) {
    				e.preventDefault();
    				const originalTarget = e.target;
    				const originalX = e.clientX;
    				const originalY = e.clientY;
    				contextMenu.classList.remove('visible');
    				contextMenu.style.visibility = 'hidden';
    				contextMenu.innerHTML = '';
    				const items = getContextMenuItems(originalTarget, originalX, originalY);
    				items.forEach(item => {
    					if (item.separator) {
    						const separator = document.createElement('div');
    						separator.className = 'context-menu-separator';
    						contextMenu.appendChild(separator);
    					} else {
    						const menuItem = document.createElement('div');
    						menuItem.className = 'context-menu-item';
    						if (item.enabled === false) {
    							menuItem.classList.add('disabled');
    						}
    						const label = document.createElement('span');
    						label.textContent = item.label;
    						menuItem.appendChild(label);
    						if (item.shortcut) {
    							const shortcut = document.createElement('span');
    							shortcut.className = 'context-menu-shortcut';
    							shortcut.textContent = item.shortcut;
    							menuItem.appendChild(shortcut);
    						}
    						if (item.enabled !== false) {
    							menuItem.addEventListener('click', (ev) => {
    								ev.stopPropagation();
    								hideContextMenu();
    								setTimeout(() => {
    									try {
    										item.action();
    									} catch (err) {
    										console.error('Context menu action error:', err);
    									}
    								}, 0);
    							});
    						}
    						contextMenu.appendChild(menuItem);
    					}
    				});
    				contextMenu.style.left = '0px';
    				contextMenu.style.top = '0px';
    				contextMenu.classList.add('visible');
    				const rect = contextMenu.getBoundingClientRect();
    				const menuWidth = rect.width;
    				const menuHeight = rect.height;
    				let finalX = originalX;
    				let finalY = originalY;
    				if (originalX + menuWidth > window.innerWidth) {
    					finalX = originalX - menuWidth;
    				}
    				if (originalY + menuHeight > window.innerHeight) {
    					finalY = originalY - menuHeight;
    				}
    				finalX = Math.max(0, finalX);
    				finalY = Math.max(0, finalY);
    				contextMenu.style.left = finalX + 'px';
    				contextMenu.style.top = finalY + 'px';
    				contextMenu.style.visibility = 'visible';
    			}
    			function hideContextMenu() {
    				if (contextMenu) {
    					contextMenu.classList.remove('visible');
    					APP_CONTAINER.classList.remove('context-menu-visible');
    				}
    			}
    			document.addEventListener('DOMContentLoaded', function() {
            APP_CONTAINER = document.querySelector('.cgp-container') || document.body;
                
    				contextMenu = createContextMenu();
    				setValuePopup = createSetValuePopup();
    				document.addEventListener('contextmenu', showContextMenu);
    				document.addEventListener('click', (e) => {
    					if (!contextMenu.contains(e.target)) {
    						hideContextMenu();
    					}
    					if (!setValuePopup.popup.contains(e.target)) {
    						hideSetValuePopup();
    					}
    				});
    				document.addEventListener('scroll', () => {
    				    hideContextMenu();
    				    hideSetValuePopup();
    				}, true); // Use capture to catch the event early				
    				document.addEventListener('keydown', (e) => {
    					if (e.key === 'Escape') {
    						hideContextMenu();
    						hideSetValuePopup();
    					}
    				});
    			});
    			document.addEventListener('DOMContentLoaded', function() {
    				const hueSlider = document.getElementById('hueSlider');
    				const saturationSlider = document.getElementById('baseSaturation');
    				const brightnessSlider = document.getElementById('baseBrightness');
    				const hexInput = document.getElementById('hexInput');
    				const selectedColorDisplay = document.getElementById('selectedColorDisplay');
    				const advancedControlsBtn = document.getElementById('advancedControlsBtn');
    				const colorGenerator = document.querySelector('.color-generator');
    				const palettesContainer = document.getElementById('cgPalettesContainer');
    				const colorFormatDropdown = document.getElementById('colorFormatDropdown');
    				const tooltip = document.getElementById('cgColorTooltip');
    				const resetAllBtn = document.getElementById('resetAllBtn');
    				const shareButton = document.getElementById('shareButton');
    				const undoBtn = document.getElementById('undoBtn');
    				const redoBtn = document.getElementById('redoBtn');
    				if (undoBtn) {
    					undoBtn.addEventListener('click', undo);
    				}
    				if (redoBtn) {
    					redoBtn.addEventListener('click', redo);
    				}
    				let isMouseDownOnColorDisplay = false;
    				let tooltipTimer = null;
    				let lastMouseX = 0;
    				let lastMouseY = 0;
    				let longPressTimer;
    				let touchStartX, touchStartY;
    				const longPressDuration = 500; // Time in ms to trigger a long press
    				function handleTouchStart(e) {
    					if (longPressTimer) {
    						clearTimeout(longPressTimer);
    						longPressTimer = null;
    					}
    					if (e.touches.length > 1) {
    						return;
    					}
    					const touch = e.touches[0];
    					touchStartX = touch.clientX;
    					touchStartY = touch.clientY;
    					const touchTarget = document.elementFromPoint(touchStartX, touchStartY);
    					if (!touchTarget) {
    						console.warn('No target element found at touch point');
    						return;
    					}
    					longPressTimer = setTimeout(() => {
    						longPressTimer = null;
    						e.preventDefault();
    						e.stopPropagation();
    						const syntheticEvent = new MouseEvent('contextmenu', {
    							bubbles: true,
    							cancelable: true,
    							view: window,
    							clientX: touchStartX,
    							clientY: touchStartY
    						});
    						Object.defineProperty(syntheticEvent, 'target', {
    							value: touchTarget,
    							enumerable: true
    						});
    						showContextMenu(syntheticEvent);
    						if ('vibrate' in navigator) {
    							navigator.vibrate(50);
    						}
    					}, longPressDuration);
    				}
    				document.addEventListener('contextmenu', (e) => {
    					if (isTouchDevice) {
    						e.preventDefault();
    						e.stopPropagation();
    						return false;
    					}
    					showContextMenu(e);
    				}, { capture: true });
    				function handleTouchMove(e) {
    					const touch = e.touches[0];
    					const deltaX = Math.abs(touch.clientX - touchStartX);
    					const deltaY = Math.abs(touch.clientY - touchStartY);
    					if (deltaX > 10 || deltaY > 10) {
    						clearTimeout(longPressTimer);
    					}
    				}
    				function handleTouchEnd() {
    					if (longPressTimer) {
    						clearTimeout(longPressTimer);
    						longPressTimer = null;
    					}
    				}
    				document.addEventListener('touchstart', handleTouchStart, { passive: false });
    				document.addEventListener('touchmove', handleTouchMove);
    				document.addEventListener('touchend', handleTouchEnd);
    				document.addEventListener('touchcancel', handleTouchEnd); // Also clear on interruption.
    				function restructureForMobile() {
    					const leftControls = document.querySelector('.cg-left-controls');
    					const rightControls = document.querySelector('.cg-right-controls');
    					const bottomButtons = document.querySelector('.cg-bottom-buttons-row');
    					const isMobile = window.matchMedia('(max-width: 768px)').matches;
    					if (isMobile && leftControls && bottomButtons && rightControls) {
    						leftControls.classList.add('mobile-layout');
    						if (bottomButtons.parentNode !== leftControls) {
    							leftControls.appendChild(bottomButtons);
    						}
    					} else if (!isMobile && leftControls && bottomButtons && rightControls) {
    						leftControls.classList.remove('mobile-layout');
    						if (bottomButtons.parentNode !== rightControls) {
    							rightControls.appendChild(bottomButtons);
    						}
    					}
    				}
    				restructureForMobile();
    				let resizeTimer;
    				window.addEventListener('resize', function() {
    					clearTimeout(resizeTimer);
    					resizeTimer = setTimeout(restructureForMobile, 250);
    				});
    				let resizeStatusTimer;
    				window.addEventListener('resize', function() {
    					clearTimeout(resizeStatusTimer);
    					resizeStatusTimer = setTimeout(() => {
    						updateFileStatus();
    					}, 100);
    				});				
    				initializeAndGeneratePalettes();
    				updateFileStatus();
    				updateUndoRedoButtons();
    				checkForChanges(); // Initial check for reset button state
    				palettesContainer.addEventListener('click', (e) => {
    					const pinButton = e.target.closest('.cg-pin-button');
    					if (pinButton) {
    						e.preventDefault();
    						animatePinning(pinButton.closest('.cg-palette-section'));
    						return;
    					}
    					const swatch = e.target.closest('.cg-color-swatch');
    					if (swatch) {
    						if (e.target.closest('.cg-swatch-dropdown-inside') || e.target.closest('.cg-action-button')) {
    							return;
    						}
    						if (!isTouchDevice) {
    							clearTimeout(tooltipTimer);
    							tooltip.classList.remove('visible');
    						}
    						copyToClipboard(swatch.dataset.colorValue);
    						swatch.classList.add('copied');
    						setTimeout(() => swatch.classList.remove('copied'), 400);
    					}
    				});
    				if (!isTouchDevice) {
    					function showTooltip(element, text) {
    						tooltip.textContent = text;
    						const rect = element.getBoundingClientRect();
    						tooltip.style.left = `${rect.left + rect.width / 2}px`;
    						tooltip.style.top = `${rect.top - 10}px`;
    						tooltip.style.transform = 'translate(-50%, -100%)';
    						tooltip.classList.add('visible');
    					}
    					function hideTooltip() {
    						tooltip.classList.remove('visible');
    					}
    					palettesContainer.addEventListener('mousemove', e => {
    						lastMouseX = e.clientX;
    						lastMouseY = e.clientY;
    						if (tooltip.classList.contains('visible') && (e.target.closest('.cg-color-swatch') || e.target.closest('.cg-proportion-bar-container'))) {
    							 tooltip.style.left = `${lastMouseX}px`;
    							 tooltip.style.top = `${lastMouseY}px`;
    							 tooltip.style.transform = 'translate(-50%, -120%)';
    						}
    					});
    					palettesContainer.addEventListener('mouseover', e => {
    						const swatch = e.target.closest('.cg-color-swatch');
    						const proportionBar = e.target.closest('.cg-proportion-bar-container');
    						const pinButton = e.target.closest('.cg-pin-button');
    						const lockButton = e.target.closest('.cg-lock-button');
    						if (swatch) {
    							clearTimeout(tooltipTimer);
    							tooltip.classList.remove('visible');
    							tooltipTimer = setTimeout(() => {
    								tooltip.textContent = swatch.dataset.colorValue;
    								tooltip.style.left = `${lastMouseX}px`;
    								tooltip.style.top = `${lastMouseY}px`;
    								tooltip.style.transform = 'translate(-50%, -120%)';
    								tooltip.style.textTransform = 'uppercase'; // Force uppercase for color codes
    								tooltip.style.fontFamily = "'Monaco', monospace"; // Monospace for codes
    								tooltip.classList.add('visible');
    							}, 500);
    						} else if (proportionBar) {
    							clearTimeout(tooltipTimer);
    							tooltip.classList.remove('visible');
    							tooltipTimer = setTimeout(() => {
    								tooltip.textContent = "Recommended proportions";
    								tooltip.style.left = `${lastMouseX}px`;
    								tooltip.style.top = `${lastMouseY}px`;
    								tooltip.style.transform = 'translate(-50%, -120%)';
    								tooltip.style.textTransform = 'none'; // Normal case for text
    								tooltip.style.fontFamily = "'Poppins', sans-serif"; // Regular font for text
    								tooltip.classList.add('visible');
    							}, 500);
    						} else if (pinButton) {
    							clearTimeout(tooltipTimer);
    							tooltip.classList.remove('visible');
    							tooltipTimer = setTimeout(() => {
    								const isPinned = pinButton.closest('.cg-palette-section').classList.contains('pinned');
    								tooltip.textContent = isPinned ? 'Unpin palette' : 'Pin palette';
    								tooltip.style.left = `${lastMouseX}px`;
    								tooltip.style.top = `${lastMouseY}px`;
    								tooltip.style.transform = 'translate(-50%, -120%)';
    								tooltip.style.textTransform = 'none';
    								tooltip.style.fontFamily = "'Poppins', sans-serif"; // Regular font for UI text
    								tooltip.classList.add('visible');
    							}, 500);
    						} else if (lockButton) {
    							clearTimeout(tooltipTimer);
    							tooltip.classList.remove('visible');
    							tooltipTimer = setTimeout(() => {
    								const isLocked = lockButton.closest('.cg-palette-section').classList.contains('locked');
    								tooltip.textContent = isLocked ? 'Unlock palette' : 'Lock palette';
    								tooltip.style.left = `${lastMouseX}px`;
    								tooltip.style.top = `${lastMouseY}px`;
    								tooltip.style.transform = 'translate(-50%, -120%)';
    								tooltip.style.textTransform = 'none';
    								tooltip.style.fontFamily = "'Poppins', sans-serif"; // Regular font for UI text
    								tooltip.classList.add('visible');
    							}, 500);
    						}
    					});
    					palettesContainer.addEventListener('mouseout', e => {
    						const swatch = e.target.closest('.cg-color-swatch');
    						const proportionBar = e.target.closest('.cg-proportion-bar-container');
    						const pinButton = e.target.closest('.cg-pin-button');
    						const lockButton = e.target.closest('.cg-lock-button');
    						if (swatch || proportionBar || pinButton || lockButton) {
    							clearTimeout(tooltipTimer);
    							tooltip.classList.remove('visible');
    						}
    					});
    				}
    				selectedColorDisplay.addEventListener('mousedown', (e) => {
    					if (e.button === 0 && e.target !== hexInput && e.target !== colorFormatDropdown) {
    						isMouseDownOnColorDisplay = true;
    					}
    				});
    				selectedColorDisplay.addEventListener('mouseup', (e) => {
    					if (isMouseDownOnColorDisplay && e.button === 0 && e.target !== hexInput && e.target !== colorFormatDropdown) {
    						let valueToCopy = hexInput.value;
    						if (displayFormat === 'CSS_RGB' || displayFormat === 'CSS_HSL') {
    							const mainHex = createTheoryColor(selectedHue, baseSaturation, baseBrightness);
    							const mainHsl = hexToHsl(mainHex);
    							valueToCopy = formatColorForDisplay(mainHsl.h, mainHsl.s, mainHsl.l, displayFormat);
    						}
    						copyToClipboard(valueToCopy);
    					}
    					isMouseDownOnColorDisplay = false;
    				});
    				hexInput.addEventListener('click', (e) => {
    					e.stopPropagation();
    				});
    				colorFormatDropdown.addEventListener('click', (e) => {
    					e.stopPropagation();
    				});
    				hueSlider.addEventListener('input', (e) => {
    					const oldHue = selectedHue;
    					selectedHue = parseInt(e.target.value);
    					const oldTemp = getColorTemperature(oldHue);
    					const newTemp = getColorTemperature(selectedHue);
    					if (oldTemp !== newTemp) {
    						updateWarmCoolDropdowns();
    					}
    					updateColorsAndDisplays();
    				});
    				hueSlider.addEventListener('change', saveState);
    				saturationSlider.addEventListener('input', (e) => {
    					baseSaturation = parseInt(e.target.value);
    					document.getElementById('saturationValue').textContent = baseSaturation + '%';
    					updateColorsAndDisplays();
    				});
    				saturationSlider.addEventListener('change', saveState);
    				brightnessSlider.addEventListener('input', (e) => {
    					baseBrightness = parseInt(e.target.value);
    					document.getElementById('brightnessValue').textContent = baseBrightness + '%';
    					updateColorsAndDisplays();
    				});
    				brightnessSlider.addEventListener('change', saveState);
    				function handleInput(value) {
    					const hsl = parseColorString(value);
    					if (hsl) {
    						hexInput.classList.remove('invalid');
    						updateStateFromHsl(hsl);
    					} else {
    						hexInput.classList.add('invalid');
    					}
    				}
    				hexInput.addEventListener('input', (e) => {
    					handleInput(e.target.value);
    				});
    				hexInput.addEventListener('paste', (e) => {
    					e.preventDefault();
    					const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    					e.target.value = pastedText;
    					handleInput(pastedText);
    				});
    				colorFormatDropdown.addEventListener('change', (e) => {
    					displayFormat = e.target.value;
    					updateAllColorText();
    					checkForChanges();
    				});
    				advancedControlsBtn.addEventListener('click', (e) => {
    					advancedControlsActive = !advancedControlsActive;
    					colorGenerator.classList.toggle('advanced-controls-active', advancedControlsActive);
    					const starEl = advancedControlsBtn.querySelector('.star');
    					if (starEl) {
    						starEl.textContent = advancedControlsActive ? '★' : '☆';
    					}
    				});
    				resetAllBtn.addEventListener('click', resetAll);
    				shareButton.addEventListener('click', () => {
    					const state = getCurrentState();
    					const compressedState = compressState(state);
    					const url = SHARE_BASE_URL + '#' + compressedState;
    					copyToClipboard(url, 'Share link copied!');
    				});
    				document.addEventListener('keydown', (e) => {
    					if (e.ctrlKey && e.key.toLowerCase() === 'z') {
    						e.preventDefault();
    						undo();
    					}
    					if (e.ctrlKey && e.key.toLowerCase() === 'y') {
    						e.preventDefault();
    						redo();
    					}
    				});
    				document.addEventListener('dblclick', handleSliderDoubleClick);
    				updateHueSliderGradient();
    				function initWelcomePopup() {
    					const overlay = document.getElementById('welcomeOverlay');
    					const closeX = document.getElementById('welcomeCloseX');
    					const closeBtn = document.getElementById('welcomeCloseBtn');
    					const helpLink = document.getElementById('helpLink');
    					const content = document.getElementById('welcomeContent');
    					const hasSeenWelcome = localStorage.getItem('hasSeenColorPaletteWelcome');
    					if (!hasSeenWelcome) {
    						overlay.style.display = 'flex';
    						setTimeout(() => {
    							overlay.classList.add('visible');
    						}, 500);
    					} else {
    						overlay.style.display = 'none';
    					}
    					const helpContent = isTouchDevice ? `
    						<h3>🎨 Getting Started</h3>
    						<ul>
    							<li>Use the <span class="highlight">color wheel slider</span> at the top to select your base color</li>
    							<li>Adjust <span class="highlight">Saturation</span> and <span class="highlight">Brightness</span> below for the perfect shade</li>
    							<li>Your main color appears in the center display box - tap it to copy</li>
    						</ul>
    						<h3>📱 Touch Controls</h3>
    						<ul>
    							<li><span class="highlight">Long-press</span> anywhere for context menus with additional options</li>
    							<li><span class="highlight">Tap</span> any color swatch to copy its color code</li>
    						</ul>
    						<h3>🎯 Color Palettes</h3>
    						<ul>
    							<li>Nine different palette types are generated automatically</li>
    							<li>Each palette includes <span class="highlight">Dark</span> and <span class="highlight">Light</span> variants</li>
    							<li>Use the <span class="highlight">Pin</span> button to keep palettes at the top</li>
    							<li>Use the <span class="highlight">Lock</span> button to preserve a palette's colors</li>
    						</ul>
    						<h3>⚙️ Pro Controls</h3>
    						<ul>
    							<li>Tap <span class="highlight">Pro Controls ☆</span> to reveal fine-tuning options</li>
    							<li>Each palette has unique controls for customization</li>
    							<li>Long-press on any palette for quick actions like reset or copy CSS</li>
    						</ul>
    						<h3>💾 Saving & Sharing</h3>
    						<ul>
    							<li>Your work is <span class="highlight">auto-saved</span> locally as you make changes</li>
    							<li>Use the <span class="highlight">+ menu</span> to save/open project files (.cgp)</li>
    							<li>Create <span class="highlight">New Project</span> to start fresh</li>
    							<li>Use <span class="highlight">Share</span> to create a link to your color scheme</li>
    							<li>Export palettes as <span class="highlight">PNG images</span> or <span class="highlight">CSS variables</span></li>
    						</ul>
    					` : `
    						<h3>🎨 Getting Started</h3>
    						<ul>
    							<li>Use the <span class="highlight">color wheel slider</span> at the top to select your base color</li>
    							<li>Adjust <span class="highlight">Saturation</span> and <span class="highlight">Brightness</span> below for the perfect shade</li>
    							<li>Your main color appears in the center display box - click it to copy</li>
    						</ul>
    						<h3>🖱️ Mouse Controls</h3>
    						<ul>
    							<li><span class="highlight">Right-click</span> anywhere for context menus with additional options</li>
    							<li><span class="highlight">Click</span> any color swatch to copy its color code</li>
    							<li><span class="highlight">Double-click</span> sliders to reset them to default values</li>
    							<li><span class="highlight">Hover</span> over colors to preview their values</li>
    						</ul>
    						<h3>🎯 Color Palettes</h3>
    						<ul>
    							<li>Nine different palette types are generated automatically</li>
    							<li>Each palette includes <span class="highlight">Dark</span> and <span class="highlight">Light</span> variants</li>
    							<li>Use the <span class="highlight">Pin</span> button to keep palettes at the top</li>
    							<li>Use the <span class="highlight">Lock</span> button to preserve a palette's colors</li>
    						</ul>
    						<h3>⚙️ Pro Controls</h3>
    						<ul>
    							<li>Click <span class="highlight">Pro Controls ☆</span> to reveal fine-tuning options</li>
    							<li>Each palette has unique controls for customization</li>
    							<li>Right-click on any palette for quick actions like reset or copy CSS</li>
    						</ul>
    						<h3>💾 Saving & Sharing</h3>
    						<ul>
    							<li>Your work is <span class="highlight">auto-saved</span> locally as you make changes</li>
    							<li>Use the <span class="highlight">+ menu</span> for file operations:
    								<ul style="margin-top: 5px;">
    									<li><span class="highlight">New/Open/Save</span> project files (.cgp)</li>
    									<li><span class="highlight">Ctrl+S</span> to save, <span class="highlight">Ctrl+O</span> to open</li>
    								</ul>
    							</li>
    							<li>Use <span class="highlight">Share</span> to create a link to your color scheme</li>
    							<li>Export palettes as <span class="highlight">PNG images</span> or <span class="highlight">CSS variables</span></li>
    						</ul>
    						<h3>⌨️ Keyboard Shortcuts</h3>
    						<ul>
    							<li><span class="highlight">Ctrl+Z</span> - Undo last change</li>
    							<li><span class="highlight">Ctrl+Y</span> - Redo last change</li>
    							<li><span class="highlight">Ctrl+N</span> - New project</li>
    							<li><span class="highlight">Ctrl+O</span> - Open project file</li>
    							<li><span class="highlight">Ctrl+S</span> - Save project</li>
    							<li><span class="highlight">Ctrl+Shift+S</span> - Save as new file</li>
    						</ul>
    					`;
    					content.innerHTML = helpContent;
    					if (!hasSeenWelcome) {
    						overlay.style.display = 'flex'; // Make sure it's displayed
    						setTimeout(() => {
    							overlay.classList.add('visible');
    						}, 500);
    					}
    					function closeWelcome() {
    						overlay.classList.remove('visible');
    						setTimeout(() => {
    							overlay.style.display = 'none';
    						}, 300);
    						localStorage.setItem('hasSeenColorPaletteWelcome', 'true');
    					}
    					closeX.addEventListener('click', closeWelcome);
    					closeBtn.addEventListener('click', closeWelcome);
    					overlay.addEventListener('click', (e) => {
    						if (e.target === overlay) {
    							closeWelcome();
    						}
    					});
    					helpLink.addEventListener('click', () => {
    						overlay.style.display = 'flex'; // Make sure it's displayed
    						setTimeout(() => {
    							overlay.classList.add('visible');
    						}, 10); // Small delay for animation
    					});
    					document.addEventListener('keydown', (e) => {
    						if (e.key === 'Escape' && overlay.classList.contains('visible')) {
    							closeWelcome();
    						}
    					});
    				}
    				initWelcomePopup();				
    				const fileMenuBtn = document.getElementById('fileMenuBtn');
    				const fileDropdown = document.createElement('div');
    				fileDropdown.className = 'file-dropdown';
    				fileDropdown.innerHTML = `
    					<div class="file-dropdown-item" id="newProjectItem">
    						<span>New Project</span>
    						${isTouchDevice ? '' : '<span class="file-dropdown-shortcut">Ctrl+N</span>'}
    					</div>
    					<div class="file-dropdown-item" id="openFileItem">
    						<span>Open...</span>
    						${isTouchDevice ? '' : '<span class="file-dropdown-shortcut">Ctrl+O</span>'}
    					</div>
    					<div class="file-dropdown-item" id="saveFileItem">
    						<span>Save</span>
    						${isTouchDevice ? '' : '<span class="file-dropdown-shortcut">Ctrl+S</span>'}
    					</div>
    					<div class="file-dropdown-item" id="saveAsFileItem">
    						<span>Save As...</span>
    						${isTouchDevice ? '' : '<span class="file-dropdown-shortcut">Ctrl+Shift+S</span>'}
    					</div>
    				`;
    				APP_CONTAINER.appendChild(fileDropdown);
    				fileMenuBtn.addEventListener('click', (e) => {
    					e.stopPropagation();
    					const rect = fileMenuBtn.getBoundingClientRect();
    					fileDropdown.style.position = 'fixed';
    					fileDropdown.style.top = (rect.bottom + 8) + 'px';
    					fileDropdown.style.right = (window.innerWidth - rect.right) + 'px';
    					fileDropdown.classList.toggle('visible');
    				});
    				document.addEventListener('click', () => {
    					fileDropdown.classList.remove('visible');
    				});
    				document.getElementById('newProjectItem').addEventListener('click', newProject);
    				document.getElementById('openFileItem').addEventListener('click', openFile);
    				document.getElementById('saveFileItem').addEventListener('click', saveFile);
    				document.getElementById('saveAsFileItem').addEventListener('click', saveAsFile);
    				document.addEventListener('keydown', (e) => {
    					if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'n') {
    						e.preventDefault();
    						newProject();
    					}
    					if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'o') {
    						e.preventDefault();
    						openFile();
    					}
    					if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 's') {
    						e.preventDefault();
    						saveFile();
    					}
    					if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
    						e.preventDefault();
    						saveAsFile();
    					}
    				});
    			});

})();

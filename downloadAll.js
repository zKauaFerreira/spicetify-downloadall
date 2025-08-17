/**
 * @name         Spicetify Download All
 * @description  Adds a reactive button to download all playlists in the Spotify library.
 * @author       zKauaFerreira
 * @version      1.0.9
 * @date         16/08/2025
 */

(function DownloadAllExtension() {
    if (!Spicetify.Platform || !Spicetify.showNotification || !Spicetify.Tippy) {
        setTimeout(DownloadAllExtension, 300);
        return;
    }

    const SVG_DOWNLOAD = `
        <svg data-encore-id="icon" role="img" aria-hidden="true" class="e-91000-icon e-91000-baseline" viewBox="0 0 24 24" style="--encore-icon-height: var(--encore-graphic-size-decorative-smaller); --encore-icon-width: var(--encore-graphic-size-decorative-smaller);">
            <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12"></path>
            <path d="M12 6.05a1 1 0 0 1 1 1v7.486l1.793-1.793a1 1 0 1 1 1.414 1.414L12 18.364l-4.207-4.207a1 1 0 1 1 1.414-1.414L11 14.536V7.05a1 1 0 0 1 1-1"></path>
        </svg>`;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function getAllPlaylistsRecursive(items) {
        let playlists = [];
        for (const item of items) {
            if (item.type === 'playlist') {
                playlists.push(item);
            } else if (item.type === 'folder' && item.items) {
                playlists = playlists.concat(getAllPlaylistsRecursive(item.items));
            }
        }
        return playlists;
    }

    async function getMissingPlaylists() {
        // CORREÇÃO: Garante que `downloadedItems` seja sempre uma lista, mesmo que a API falhe.
        const downloadedItems = (await Spicetify.Platform.OfflineAPI.getDownloads()) || [];
        const downloadedSet = new Set(downloadedItems.map(item => item.uri));
        
        const rootlists = await Spicetify.Platform.RootlistAPI.getContents();
        const allPlaylists = getAllPlaylistsRecursive(rootlists.items);
        
        return allPlaylists.filter(pl => !downloadedSet.has(pl.uri));
    }
    
    async function checkLibraryAndSetButtonVisibility(btn) {
        if (!btn) return;

        try {
            const missingPlaylists = await getMissingPlaylists();
            const needsToShowButton = missingPlaylists.length > 0;
            
            btn.style.display = needsToShowButton ? 'flex' : 'none';
        } catch (err) {
            console.error("[DownloadAll] Error during visibility check:", err);
            btn.style.display = 'none'; // Esconde o botão em caso de erro.
        }
    }

    async function createReactiveDownloadButton(container) {
        if (document.querySelector("#downloadAllBtn")) return;

        const btn = document.createElement("button");
        btn.id = "downloadAllBtn";
        btn.className = container.querySelector("button").className;
        btn.setAttribute("data-encore-id", "buttonTertiary");
        btn.setAttribute("aria-label", "Download All");
        
        btn.style.marginRight = "4px";
        btn.innerHTML = SVG_DOWNLOAD;
        
        btn.style.display = 'none';
        container.prepend(btn);

        Spicetify.Tippy(btn, {
            content: 'Download All',
            placement: 'top',
            className: 'main-tooltip-text',
        });

        btn.onclick = async () => {
            try {
                btn.disabled = true;
                const playlistsToDownload = await getMissingPlaylists();

                if (playlistsToDownload.length > 0) {
                    Spicetify.showNotification(`Marking ${playlistsToDownload.length} playlists for download...`);
                    await Promise.all(playlistsToDownload.map(pl => Spicetify.Platform.OfflineAPI.addDownload(pl.uri)));
                    Spicetify.showNotification("Playlists added to download queue!");
                }
            } catch (err) {
                console.error("[DownloadAll] Error while downloading:", err);
                Spicetify.showNotification("An error occurred while downloading playlists.", true);
            } finally {
                btn.disabled = false;
            }
        };

        const debouncedCheck = debounce(() => {
            checkLibraryAndSetButtonVisibility(btn);
        }, 1500);

        checkLibraryAndSetButtonVisibility(btn);

        Spicetify.Platform.RootlistAPI.getEvents().addListener('update', debouncedCheck);
        Spicetify.Platform.OfflineAPI.getEvents().addListener('update', debouncedCheck);
    }

    const waitForElement = (selector, callback) => {
        const observer = new MutationObserver((_mutations, obs) => {
            const el = document.querySelector(selector);
            if (el) {
                obs.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    waitForElement(".main-yourLibraryX-headerContent .BZh0f1vbOmruyp4_t9wy", createReactiveDownloadButton);
})();

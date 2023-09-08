// ==UserScript==
// @name         TikTok Video Context Menu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a "hello" option to the context menu on TikTok video
// @author       You
// @match        https://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const HEADERS = new Headers({
        'User-Agent': 'TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet'
    });

    const getIdVideo = (url) => {
        const matching = url.includes("/video/");
        if (!matching) {
            console.error("[X] Error: URL not found");
            return null;
        }
        const idVideo = url.substring(url.indexOf("/video/") + 7, url.length);
        return (idVideo.length > 19) ? idVideo.substring(0, idVideo.indexOf("?")) : idVideo;
    };

    const getVideoNoWM = async (url) => {
        const idVideo = getIdVideo(url);
        if (!idVideo) return null;

        const API_URL = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${idVideo}`;
        try {
            const request = await fetch(API_URL, { method: "GET", headers: HEADERS });
            const body = await request.text();
            const res = JSON.parse(body);
            console.log(res)
            return res;
        } catch (err) {
            console.error("Error:", err);
            return null;
        }
    };

    const addContextMenuOption = (videoContainers) => {
        videoContainers.forEach(videoContainer => {
            videoContainer.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                createAndAppendMenuItem(e);
            });
        });
    };

    const createAndAppendMenuItem = (e) => {
        setTimeout(() => {
            const popupMenu = document.querySelector('ul[class*="UlPopupContainer"]');
            if (popupMenu) {
                const existingHelloItem = Array.from(popupMenu.querySelectorAll('li')).find(li => li.textContent === "hello");
                if (!existingHelloItem) {
                    const firstMenuItem = popupMenu.querySelector('li');
                    if (firstMenuItem) {
                        const newItem = firstMenuItem.cloneNode(true);
                        const textSpan = newItem.querySelector('span[class*="SpanItemText"]');
                        if (textSpan) {
                            textSpan.textContent = "hello";
                        }

                        newItem.addEventListener('click', async () => {
                            const currentPageUrl = window.location.href;
                            console.log('Current Page URL:', currentPageUrl);

                            const videoData = await getVideoNoWM(currentPageUrl);
                            if (videoData) {
                                try {
                                    const response = await fetch(videoData.aweme_list[0].video.play_addr.url_list[0]);
                                    const videoBlob = await response.blob();
                                    const blobUrl = URL.createObjectURL(videoBlob);

                                    const a = document.createElement('a');
                                    a.href = blobUrl;
                                    a.download = videoData.aweme_list[0].aweme_id+".mp4"; // You can give any name you want
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                } catch (error) {
                                    console.error('Error fetching video data:', error);
                                }
                            } else {
                                console.error('Failed to fetch video data');
                            }
                        });

                        popupMenu.appendChild(newItem);
                    } else {
                        console.log('Failed to find the first menu item');
                    }
                }
            } else {
                console.log('Popup menu not found');
            }
        }, 100);
    };

    window.addEventListener('load', () => {
        console.log('Window loaded');
        const videoContainers = document.querySelectorAll('div[class*="DivVideoContainer"]');
        console.log('Video containers found:', videoContainers.length);

        addContextMenuOption(videoContainers);
    });

})();

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

    window.addEventListener('load', () => {
        console.log('Window loaded');

        const videoContainers = document.querySelectorAll('div[class*="DivVideoContainer"]');

        console.log('Video containers found:', videoContainers.length);

        videoContainers.forEach(videoContainer => {
            videoContainer.addEventListener('contextmenu', (e) => {
                console.log('Context menu triggered on video container');

                e.preventDefault();

                // 创建一个新的菜单项
                const menuItem = document.createElement('li');
                menuItem.innerText = 'hello';
                menuItem.style.cursor = 'pointer';

                // 在一段时间后添加到弹出菜单中，以确保它已被创建
                setTimeout(() => {
                    const popupMenu = document.querySelector('ul[class*="UlPopupContainer"]');
                    if (popupMenu) {
                        console.log('Popup menu found', popupMenu);
                        // 检查是否已经有一个"hello"选项
                        const existingHelloItem = Array.from(popupMenu.querySelectorAll('li')).find(li => li.textContent === "hello");
                        if (existingHelloItem) {
                            console.log('"hello" option already exists');
                            return;
                        }
                        // 获取菜单中的第一个li元素并复制它
                        const firstMenuItem = popupMenu.querySelector('li');
                        if (firstMenuItem) {
                            const newItem = firstMenuItem.cloneNode(true);

                            // 获取并更改文本span的内容
                            const textSpan = newItem.querySelector('span[class*="SpanItemText"]');
                            if (textSpan) {
                                textSpan.textContent = "hello";
                            }

                            // 添加点击事件监听器
                            newItem.addEventListener('click', () => {
                                alert('hello, tiktok');
                            });

                            // 将新的li元素添加到菜单中
                            popupMenu.appendChild(newItem);

                            console.log('Added new menu item');
                        } else {
                            console.log('Failed to find the first menu item');
                        }
                    } else {
                        console.log('Popup menu not found');
                    }
                }, 100);

                menuItem.addEventListener('click', () => {
                    console.log('Hello menu item clicked');
                    alert('hello, tiktok');
                    // 从菜单中移除自定义项
                    menuItem.remove();
                });
            });
        });
    });
})();
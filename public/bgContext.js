/*chrome.runtime.onInstalled.addListener(() => {
    
    chrome.declarativeContent.onPageChanged.removeRules(
        undefined,
        () => chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({ 
                        pageUrl: {hostEquals: 'developer.chrome.com'} 
                    })
                ],
                actions: [
                    new chrome.declarativeContent.ShowPageAction()
                ]
            }
        ])
    );
    
});*/

chrome.browserAction.setBadgeText({ text: '123' });
chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0090' });
/*chrome.browserAction.onClicked.addListener(tab => {
    if (tab.incognito) return;
    if (tab.url) {
        console.log(tab.url);
        return;
    }
});*/

const contextMenuItem = {
    id: "saveWebPage",
    title: chrome.i18n.getMessage("extName"),
    contexts: ["all"]
};
chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.onClicked.addListener(data => {
    if (data.menuItemId === "saveWebPage") {
        return;
    }
})
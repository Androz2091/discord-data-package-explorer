import axios from 'axios';

export const generateAvatarURL = (avatarHash, id, discriminator) => {
    let avatarURL = 'https://cdn.discordapp.com/';
    if (avatarHash) avatarURL += `avatars/${id}/${avatarHash}.webp`;
    else avatarURL += `embed/avatars/${discriminator % 5}.png`;
    return avatarURL;
};

export const getCreatedTimestamp = (id) => {
    const EPOCH = 1420070400000;
    return id / 4194304 + EPOCH;
};

export const getFavoriteWords = (words) => {
    words = words.flat(3);
    
    let item,
        length = words.length,
        array = [],
        object = {};
    
    for (let index = 0; index < length; index++) {
        item = words[index];
        if (!item) continue;
    
        if (!object[item]) object[item] = 1;
        else ++object[item];
    }
    
    for (let p in object) array[array.length] = p;
    
    return array.sort((a, b) => object[b] - object[a]).map((word) => ({ word: word, count: object[word] })).slice(0, 10);
};

export const getGitHubContributors = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://api.github.com/repos/Androz2091/discord-data-package-explorer/contributors')
            .then((response) => {

                resolve(response.data.map((user) => { return { username: user.login, avatar: user.avatar_url, url: user.html_url } }));
            }).catch((error) => {
                console.log(error);

                reject([]);
            });
    });
};
  
export const events = {
//    permissionsRequested: 0,
    channelUpdated: 0,
    //    createGuildViewed: 0,
    //    registerViewed: 0,
    joinVoiceChannel: 0,
    //    videoStreamEnded: 0,
    spotifyListenAlongStarted: 0,
    //    changeLogVideoInteracted: 0,
    //    mktgApplicationStep: 0,
    emailOpened: 0,
    premiumGuildSubscriptionCanceled: 0,
    screenshareFinished: 0,
    //    videoLayoutToggled: 0,
    afViewed: 0,
    //    spotifyListenAlongEnded: 0,
    //    experimentGuildTriggered: 0,
    changeLogOpened: 0,
    sendMessage: 0,
    //    closeTutorial: 0,
    guildViewed: 0,
    //    afExited: 0,
    ringCall: 0,
    ackMessages: 0,
    voiceConnectionSuccess: 0,
    //    friendAddViewed: 0,
    webhookCreated: 0,
    //    micTestingStarted: 0,
    //    guildMemberUpdated: 0,
    //    searchOpened: 0,
    //    voiceDisconnect: 0,
    searchStarted: 0,
    //    openPopout: 0,
    //    keyboardModeToggled: 0,
    //    promotionViewed: 0,
    //   appUiViewed: 0,
    authorizedAppConnected: 0,
    //    guildInsightsGuildGridViewed: 0,
    giftCodeCopied: 0,
    startSpeaking: 0,
    readyPayloadReceived: 0,
    //    changeLogCtaClicked: 0,
    sessionStart: 0,
    inviteAppOpened: 0,
    //    accountLinkStep: 0,
    //    searchResultViewed: 0,
    //    applicationClosed: 0,
    jump: 0,
    //    mainNavigationMenu: 0,
    //    updateUserSettings: 0,
    //    footerNavigation: 0,
    //    subscriptionCanceled: 0,
    //    mailingListContactUpdateFailed: 0,
    //    storeDirectoryViewed: 0,
    //    userFingerprinted: 0,
    //    userAttributionReceived: 0,
    //    paymentFlowCompleted: 0,
    activityUpdated: 0,
    //    paymentSourceAdded: 0,
    //    premiumMarketingPageViewed: 0,
    //    oauth2AuthorizeViewed: 0,
    //    streamReportProblem: 0,
    guildRoleUpdated: 0,
    externalDynamicLinkReceived: 0,
    channelOpened: 0,
    //    guildOutageViewed: 0,
    //    friendsListViewed: 0,
    //    guildWelcomeScreenSettingsUpdated: 0,
    //    appLandingViewed: 0,
    //    storeListingUpdated: 0,
    //    storeListingViewed: 0,
    loginSuccessful: 0,
    //    changeLogClosed: 0,
    //    subscriptionPaymentSourceAdded: 0,
    //    paymentSucceeded: 0,
    //    disableTotp: 0,
    customStatusUpdated: 0,
    //    micTestingStopped: 0,
    //    applicationCommandSelected: 0,
    //    skuUpdated: 0,
    dmListViewed: 0,
    guildSettingsUpdated: 0,
    //    nuoTransition: 0,
    expressionPickerTabClicked: 0,
    //    paymentFailed: 0,
    applicationCommandUsed: 0,
    //    userPremiumGuildSubscriptionSlotCreated: 0,
    //    voiceProcessing: 0,
    //    devPortalAuthUrlCopied: 0,
    launchGame: 0,
    //    sessionEnd: 0,
    //    appExceptionThrown: 0,
    //    dataRequestInitiated: 0,
    inviteOpened: 0,
    //    mktgPageViewed: 0,
    copyInstantInvite: 0,
    //    screenshareFailed: 0,
    //    giftCodeRevoked: 0,
    inviteAppInvoked: 0,
    deleteEmoji: 0,
    giftCodeResolved: 0,
    //    storeListingMediaScrolled: 0,
    joinCall: 0,
    giftCodeSent: 0,
    botAbused: 0,
    //    removeChannelRecipient: 0,
    presskitDownload: 0,
    //    appModulesUpdated: 0,
    //    channelNoticeClosed: 0,
    //    chatInputComponentViewed: 0,
    //    userAccountUpdated: 0,
    guildTemplateLinkUpdated: 0,
    //    searchResultSelected: 0,
    //    experimentUserTriggered: 0,
    leaveGuild: 0,
    //    mediaSessionJoined: 0,
    //    guildTemplateSelected: 0,
    //    memberListViewed: 0,
    applicationCreated: 0,
    //    streamWarningTriggered: 0,
    //    storeListingExited: 0,
    //    guildTemplateResolved: 0,
    //    guildDiscoveryExited: 0,
    appCrashed: 0,
    stopRingingCall: 0,
    transactionCompleted: 0,
    hardwareDetected: 0,
    claimAccount: 0,
    devPortalRpVizUsed: 0,
    //    authorizeLoginLocation: 0,
    //    subscriptionPeriodScheduled: 0,
    localSettingsUpdated: 0,
    userSettingsKeybindUpdated: 0,
    downloadApp: 0,
    loginViewed: 0,
    instantInviteShared: 0,
    //    channelNoticeViewed: 0,
    //    mktgHypesquadFormOpened: 0,
    //    skuEntitlementCreated: 0,
    //    premiumUpgradeStarted: 0,
    notificationClicked: 0,
    createGuild: 0,
    //    messageAttachmentUpdated: 0,
    emailSent: 0,
    //    appExternalViewClosed: 0,
    channelDeleted: 0,
    guildBotAdded: 0,
    //    libraryViewed: 0,
    //    verifyAccount: 0,
    appOpened: 0,
    //    connectedAccountInitiated: 0,
    //    devPortalPageViewed: 0,
    //    spotifyButtonClicked: 0,
    userAvatarUpdated: 0,
    //    startListening: 0,
    //    paymentFlowFailed: 0,
    //    paymentFlowOpened: 0,
    //    updateRelationship: 0,
    deepLinkReceived: 0,
    startCall: 0,
    //    privacyControlUpdated: 0,
    premiumGuildSubscriptionCreated: 0,
    //    paymentFlowStarted: 0,
    //    quickswitcherOpened: 0,
    //    applicationUpdated: 0,
    //    connectedAccountViewed: 0,
    //    streamerModeToggle: 0,
    //    settingsPaneViewed: 0,
    addReaction: 0,
    inviteViewed: 0,
    updateNote: 0,
    //    permissionsAcked: 0,
    //    gameNewsOpened: 0,
    //    updateStreamerModeSettings: 0,
    guildTemplateLinkSent: 0,
    oauth2AuthorizeAccepted: 0,
    acceptedInstantInvite: 0,
    //    leaveVoiceChannel: 0,
    //    searchResultExpanded: 0,
    //    premiumGuildSubscriptionRemoved: 0,
    removeReaction: 0,
    //    paymentFlowStep: 0,
    //    loginAttempted: 0,
    //    enableTotp: 0,
    //    applicationCommandBrowserOpened: 0,
    expressionPickerOpened: 0,
    //    appNoticeViewed: 0,
    //    expressionPickerCategorySelected: 0,
    //    afGuildVisited: 0,
    resolveInvite: 0,
    //    storeDirectoryHeroViewed: 0,
    //    serverSetupCtaClicked: 0,
    //    subscriptionRemoved: 0,
    videoStreamStarted: 0,
    //    storeDirectoryExited: 0,
    joinGuildViewed: 0,
    replyStarted: 0,
    //    quickswitcherResultSelected: 0,
    inviteSent: 0,
    //    dataRequestCompleted: 0,
    //    androidHardwareSurvey: 0,
    //    inviteSuggestionOpened: 0,
    //    webhookDeleted: 0,
    //    userPremiumGuildSubscriptionSlotCanceled: 0,
    //    guildWelcomeScreenOptionSelected: 0,
    giftCodeCreated: 0,
    //    afLoaded: 0,
    guildJoined: 0,
    //    subscriptionPlanUpdated: 0,
    //    premiumPromotionOpened: 0,
    //    analyticsDataQueried: 0,
    //    premiumMarketingPageExited: 0,
    slashCommandUsed: 0,
    //    hoverMenuOpened: 0,
    //    noiseCancellationLinkClicked: 0,
    //    friendRequestFailed: 0,
    botTokenCompromised: 0,
    //    addChannelRecipient: 0,
    //    updateConnectedAccount: 0,
    //    quickswitcherClosed: 0,
    //    channelAutocompleteOpen: 0,
    //    channelAutocompleteSelected: 0,
    //    hypesquadSubscriptionUpdated: 0,
    messageEditUpArrow: 0,
    //    callReportProblem: 0,
    //    browserHandoffSucceeded: 0,
    //    clickLandingCta: 0,
    //    searchClosed: 0,
    //    mediaDeviceChanged: 0,
    deleteGuild: 0,
    //    videoInputToggled: 0,
    //    newLoginLocation: 0,
    createChannel: 0,
    //    modalDismissed: 0,
    //    notificationSettingsUpdated: 0,
    //    channelPermissionsOverwriteUpdated: 0,
    captchaServed: 0,
    createInstantInvite: 0,
    //    channelNoticeCtaClicked: 0,
    pinMessage: 0,
    //    viewAsRolesSelected: 0,
    //    inboxChannelAcked: 0,
    //    guildInsightsSettingsCtaClicked: 0,
    //    externalPaymentSucceeded: 0,
    //    skuEntitlementUpdated: 0,
    //    storeDirectoryCardInteracted: 0,
    messageEdited: 0,
    //    searchResultSortChanged: 0,
    //    guildSettingsDiscoveryViewed: 0,
    //    userPremiumGuildSubscriptionSlotRemoved: 0,
    //    keyboardShortcutUsed: 0,
    //    applicationDeleted: 0,
    //    paymentException: 0,
    //    guildDiscoveryGuildSelected: 0,
    captchaSolved: 0,
    //    register: 0,
    //    guildDiscoveryViewed: 0,
    //    userPhoneUpdated: 0,
    //    openModal: 0,
    createEmoji: 0,
    inboxChannelClicked: 0
};

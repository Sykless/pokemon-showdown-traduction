import { isValidEnglishMenu, translateMenu, translatePokemonTeam, translateRegexBattleMessage, translateRegexValidatorMessage } from "../translator";

console.log("HomeTranslate successfully loaded !");

// Create a MutationObserver element in order to track every page change
// So we can it dynamically translate new content
var observer = new MutationObserver(onMutation);

observer.observe(document, {
	childList: true, // report added/removed nodes
	subtree: true,   // observe any descendant elements
});

// MutationObserver only process new nodes, so we need to translate the original HTML code
translateHomePage();
translateRoomPage(null);

// Everytime a new element is added to the page, onMutation method is called
function onMutation(mutations: MutationRecord[])
{
	// Iterate over every mutated nodes
	for (var i = 0, len = mutations.length; i < len ; i++)
	{		
		// console.log(mutations[i]);

		if (mutations[i].type == "childList")
		{
			var newNodes = mutations[i].addedNodes;

			for (var j = 0, node; (node = newNodes[j]); j++)
			{
				var newElement = node as Element;
                var parentElement = mutations[i].target as Element;

                // Don't want to add a break everytime a match is found
                // so instead we add a boolean that changes when no match is found
                var translatedElement = true;

				console.log(newElement.outerHTML);

                // Find element by ID
                if (newElement.id)
                {
                    // Room panel has been opened
                    if (newElement.id == "room-rooms") {
                        translateRoomPage(newElement);
                    }
                    else {
                        // No translation found
                        translatedElement = false;
                    }
                }
                else {
                    // No translation found
                    translatedElement = false;
                }
                

                // Find element by tag
                if (newElement.tagName && !translatedElement)
                {
                    // Filter option has been added
                    if (newElement.tagName == "OPTION" && newElement.textContent) {
                        newElement.textContent = translateMenu(newElement.textContent);
                    }
                    else {
                        // No translation found
                        translatedElement = false;
                    }
                }
                else {
                    // No translation found
                    translatedElement = false;
                }


                // Find element by class
                if (newElement.classList && !translatedElement)
                {
                    // Tier has been updated
                    if (newElement.classList.contains("teamselect"))
                    {
                        // Translate team name
                        updatePokemonTeamName(newElement);
                    }
                    // New window has ben opened
                    if (newElement.classList.contains("pm-window"))
                    {
                        // Translate window content
                        updateWindow(newElement);
                    }
                    // Chat message has been received
                    if (newElement.classList.contains("chat"))
                    {
                        // Translate log message (don't change chat message)
                        updateChatMessage(newElement);
                    }
                    // Challenge has been received
                    else if (newElement.className == "challenge" && newElement.firstElementChild) 
                    {
                        // Update challenge request
                        updateMainButton(newElement.firstElementChild);
                    }
                    // Challenge has been updated
                    else if (newElement.className == "battleform") 
                    {
                        // Update challenge request
                        updateMainButton(newElement);
                    }
                    // Users/Battle counter has been updated
                    else if (newElement.className == "roomcounters")
                    {
                        updateRoomCounter(newElement);
                    }
                    // User popup has been opened
                    else if (newElement.className == "userdetails")
                    {
                        updateUserDetails(newElement);
                    }
                    // Button has been added
                    else if (newElement.classList.contains("buttonbar"))
                    {
                        updateButtonBar(newElement);
                    }
                    // Popup has been opened
                    else if (newElement.className == "ps-popup")
                    {
                        updatePopup(newElement);
                    }
                    else {
                        // No translation found
                        translatedElement = false;
                        // console.log("Non-processed nodes : " + newElement.outerHTML);
                    }
                }
                else {
                    // No translation found
                    translatedElement = false;
                }


                // Find element by parent class
                if (parentElement.classList && !translatedElement)
                {
                    // Translate menu button labels
                    if (parentElement.classList.contains("mainmenu1"))
                    {
                        if (newElement.textContent) {
                            newElement.textContent = translateMenu(newElement.textContent);
                        }
                    }
                    else if (parentElement.classList.contains("roomlist"))
                    {
                        translateChatRoom(newElement);
                    }
                    // A Menugroup has been added
                    else if (parentElement.classList.contains("menugroup"))
                    {
                        // Translate team name
                        updateMenuGroup(newElement);
                    }
                    // Background has been changed
                    else if (parentElement.className == "bgcredit")
                    {
                        // Update Credits
                        updateBackgroundCredit(newElement);
                    }
                    // Volume has been updated
                    else if (parentElement.className.endsWith("-volume"))
                    {
                        // Update Credits
                        updateVolumeElement(newElement);
                    }
                    // Room updated
                    else if (parentElement.className == "inner" && newElement.tagName == "UL")
                    {
                        // Translate room name
                        updateRoomName(newElement);
                    }
                    // Team selection has been updated
                    else if (parentElement.classList.contains("teamselect"))
                    {
                        // Translate team name
                        updatePokemonTeamName(parentElement);
                    }
                }
			}
		}
	}
}

function translateRoomPage(roomMenu: Element | null)
{
    // roomMenu should always be present, but if it's not, the MutationObserver will handle the page creation
	if (!roomMenu) {
        roomMenu = document.getElementById("room-rooms");

        if (!roomMenu) {
            return
        };
	}

    roomMenu.childNodes.forEach(function (padNode) {
        padNode.childNodes.forEach(function (roomNode) {
            roomNode.childNodes.forEach(function (roomContentNode) {
                var roomContent = roomContentNode as Element;

                // Translate all labels from text/buttons
                if (roomContent.textContent && (!roomContent.tagName || roomContent.tagName == "BUTTON")) {
                    roomContent.textContent = translateMenu(roomContent.textContent);
                }
                // Translate big labels
                if (roomContent.tagName == "P" && roomContent.firstChild?.textContent) {
                    roomContent.firstChild.textContent = translateMenu(roomContent.firstChild.textContent);
                }
                // Translate room filter options
                else if (roomContent.tagName == "SELECT") {
                    var selectElement = roomContent as HTMLSelectElement;

                    for (var i = 0 ; i < selectElement.options?.length ; i++)
                    {
                        var roomFilter = selectElement.options[i].textContent;

                        if (roomFilter) {
                            selectElement.options[i].textContent = translateMenu(roomFilter);
                        }
                    }
                }
            })
        })
    })
}

function translateHomePage()
{
    var mainMenu = document.getElementsByClassName("mainmenuwrapper");

	// mainMenu should always be present, but if it's not, the MutationObserver will handle the page creation
	if (!mainMenu || mainMenu.length <= 0) {
		return;
	}

    mainMenu[0].childNodes.forEach(function (sideMenuNode) {
        var sideMenuElement = sideMenuNode as Element;

        // Battle/Teambuilder/Ladder/News
        if (sideMenuElement.className == "leftmenu")
        {
            sideMenuElement.childNodes.forEach(function (leftMenuNode) {
                var leftMenuElement = leftMenuNode as Element;

                // Battle/Teambuilder/Ladder/WatchBattle/FindUser
                if (leftMenuElement.className == "mainmenu")
                {
                    // Menugroup
                    leftMenuElement.childNodes.forEach(function (menuGroupNode) {
                        updateMenuGroup(menuGroupNode as Element);
                    })
                }
                // News
                else if (leftMenuElement.className == "activitymenu")
                {
                    
                }
            })
        }
        // Empty space if chat rooms are hidden
        else if (sideMenuElement.className == "rightmenu")
        {
            // Button the only element is within three tags layers
            var joinChatButton = sideMenuElement.firstChild?.firstChild?.firstChild as Element;
            
            if (joinChatButton.tagName == "BUTTON" && joinChatButton.textContent) {
                joinChatButton.textContent = translateMenu(joinChatButton.textContent);
            }
        }
        // Links to Showdown pages/Background credits
        else if (sideMenuElement.className == "mainmenufooter")
        {
            sideMenuElement.childNodes.forEach(function (footerNode) {
                var footerElement = footerNode as Element;

                // Links
                if (footerElement.tagName == "SMALL")
                {
                    footerElement.childNodes.forEach(function (linkNode) {
                        var linkElement = linkNode as Element;

                        if (linkElement.tagName == "A" && linkElement.textContent) {
                            linkElement.textContent = translateMenu(linkElement.textContent);
                        }
                    })
                }
                // Background credit
                else if (footerElement.className == "bgcredit") {
                    updateBackgroundCredit(footerElement.firstChild as Element)
                }
            })
        }
    })
}

function updateRoomName(roomUlElement: Element)
{
    roomUlElement.childNodes.forEach(function (roomLiNode) {
        roomLiNode.childNodes.forEach(function (roomNameNode) {
            var roomNameElement = roomNameNode as Element;

            // Translate room name
            if (roomNameElement.tagName == "A" && roomNameElement.lastChild?.textContent) {
                roomNameElement.lastChild.textContent = translateMenu(roomNameElement.lastChild.textContent);
            }
        })
    })
}

function translateChatRoom(chatRoomElement: Element)
{
    chatRoomElement.childNodes.forEach(function (roomNode) {
        var roomElement = roomNode as Element;

        // Chatroom section label
        if (!roomElement.tagName && roomElement.textContent) {
            roomElement.textContent = translateMenu(roomElement.textContent);
        }
        // Chatroom element
        else if (roomElement.tagName == "A") {
            roomElement.childNodes.forEach(function (roomDescriptionNode) {
                var roomDescription = roomDescriptionNode as Element;

                if (roomDescription.tagName == "SMALL" && roomDescription.textContent)
                {
                    // Number of connected users
                    if (roomDescription.textContent?.endsWith(" users)")) {
                        roomDescription.textContent = roomDescription.textContent.replace(" users)", "") + translateMenu(" users)");
                    }
                    // Room description
                    else {
                        roomDescription.textContent = translateMenu(roomDescription.textContent);
                    }    
                }
                // Room name
                else if (roomDescription.tagName == "STRONG") {
                    roomDescription.childNodes.forEach(function (roomNameNode) {
                        var roomNameElement = roomNameNode as Element;

                        if (!roomNameElement.tagName && roomNameElement.textContent) {
                            roomNameElement.textContent = translateMenu(roomNameElement.textContent);
                        }
                    })
                }
            })
        }
        // Subroom element
        else if (roomElement.className == "subrooms")
        {
            roomElement.childNodes.forEach(function (subRoomNode) {
                var subRoomElement = subRoomNode as Element;

                // Label
                if (!subRoomElement.tagName && subRoomElement.textContent) {
                    subRoomElement.textContent = translateMenu(subRoomElement.textContent);
                }
                // Subroom name
                else if (subRoomElement.tagName == "A" && subRoomElement.lastChild?.textContent) {
                    subRoomElement.lastChild.textContent = translateMenu(subRoomElement.lastChild.textContent);
                }
            })
        }
    })
}

function updateMenuGroup(menuGroup: Element)
{
    // Menu elements could be in a form tag
    if (menuGroup.firstElementChild?.tagName == "FORM") {
        updateMainButton(menuGroup.firstElementChild)
    }
    else {
        updateMainButton(menuGroup);
    }
}

function updateMainButton(battleForm: Element)
{
    // Mother element has a <p> tag
    battleForm.childNodes.forEach(function (pNode) {
        pNode.childNodes.forEach(function (buttonNode) {
            var buttonElement = buttonNode as Element;

            // Some information are just in plain text
            if (!buttonElement.tagName)
            {
                // Challenge request title
                if (buttonElement.textContent?.endsWith(" wants to battle!")) {
                    buttonElement.textContent = buttonElement.textContent.replace(" wants to battle!", "") + translateMenu(" wants to battle!");
                }
                else if (buttonElement.textContent?.startsWith("Challenge ")) {
                    buttonElement.textContent = translateMenu("Challenge ") + buttonElement.textContent.replace("Challenge ", "").slice(0,-1) + " ?";
                }
            }
            // Team selection
            else if (buttonElement.classList?.contains("teamselect")) {
                updatePokemonTeamName(buttonElement);
            }
            // Button
            else if (buttonElement.tagName == "BUTTON" && buttonElement.firstChild?.textContent) {
                buttonElement.firstChild.textContent = translateMenu(buttonElement.firstChild.textContent);
            }
            // Label
            else if (buttonElement.tagName == "LABEL")
            {
                // Translate every label child
                buttonElement.childNodes.forEach(function (labelNode) {
                    var labelElement = labelNode as Element;

                    if (labelElement.textContent) {
                        labelElement.textContent = translateMenu(labelElement.textContent);
                    }

                    // <abbr> elements have titles that need to be translated
                    if (labelElement.tagName == "ABBR")
                    {
                        var abbrTitle = labelElement.getAttribute("title");

                        if (abbrTitle) {
                            labelElement.setAttribute("title", translateMenu(abbrTitle));
                        }
                    }
                })
            }
        })
    })
}

function updateWindow(windowElement: Element)
{
    windowElement.childNodes.forEach(function (windowChildNode) {
        var windowChildElement = windowChildNode as Element;

        // Messages
        if (windowChildElement.className == "pm-log")
        {
            windowChildElement.childNodes.forEach(function (logWindowNode) {
                var logWindowElement = logWindowNode as Element;

                // Button log
                if (logWindowElement.className == "pm-buttonbar" && logWindowElement.firstChild?.textContent) {
                    logWindowElement.firstChild.textContent = translateMenu(logWindowElement.firstChild.textContent);
                }
                // Message log
                else if (logWindowElement.className == "inner")
                {
                    logWindowElement.childNodes.forEach(function (chatNode) {
                        updateChatMessage(chatNode as Element)
                    })
                }
            })
        }
        // Challenge
        else if (windowChildElement.className == "challenge" && windowChildElement.firstElementChild) 
        {
            // Update challenge request
            updateMainButton(windowChildElement.firstElementChild);
        }
    })
}

function updateRoomCounter(roomCounterElement: Element)
{
    roomCounterElement.childNodes.forEach(function (buttonNode)
    {
        var buttonElement = buttonNode as HTMLButtonElement;

        // Translate hover label
        if (buttonElement.title) {
            buttonElement.title = translateMenu(buttonElement.title);
        }
        
        // Translate button contents
        buttonElement.childNodes.forEach(function (buttonContentNode) {
            var buttonContent = buttonContentNode as Element;

            // Meloetta description
            if (buttonContent.tagName == "SPAN")
            {
                var spanElement = buttonContent as HTMLSpanElement;

                if (spanElement.title) {
                    spanElement.title = translateMenu(spanElement.title);
                }
            }
            // Button label
            else if (!buttonContent.tagName && buttonContent.textContent) {
                buttonContent.textContent = translateMenu(buttonContent.textContent);
            }
        })
    })
}

function updateChatMessage(chatElement: Element)
{
    chatElement.childNodes.forEach(function (chatMessageNode) {
        var chatMessage = chatMessageNode as Element;

        // Only translate log messages, not chat messages
        if (chatMessage.textContent && (chatMessage.className == "message-log" || !chatMessage.tagName) ) {
            chatMessage.textContent = translateRegexBattleMessage(chatMessage.textContent);
        }
    })
}

function updatePokemonTeamName(teamElement: Element)
{
    // Translate selected team
    teamElement.childNodes.forEach(function (teamNameNode) {
        var teamNameElement = teamNameNode as Element;

        if (teamNameElement.textContent)
        {
            // Team name is in <strong> tag
            if (teamNameElement.tagName == "STRONG") {
                teamNameElement.textContent = translatePokemonTeam(teamNameElement.textContent);
            }
            // This is not a team name but a label, just translate it
            else if (teamNameElement.tagName == "EM") {
                teamNameElement.textContent = translateMenu(teamNameElement.textContent);
            }
            // No team name either, but contains a label
            else if (teamNameElement.tagName == "SMALL") {
                var smallChild = teamNameElement.firstChild as Element;

                if (smallChild?.tagName == "EM" && smallChild.textContent) {
                    smallChild.textContent = translateMenu(smallChild.textContent);
                }
            }
        }
    })
}

function updateBackgroundCredit(footerElement: Element)
{
    footerElement.childNodes.forEach(function (backgroundNode) {
        var backgroundElement = backgroundNode as Element;

        // Pokémon Showdown day
        if (backgroundElement.tagName == "SMALL")
        {
            backgroundElement.childNodes.forEach(function (showdownDayNode) {
                if (showdownDayNode.textContent)
                {
                    // Author name
                    if (showdownDayNode.textContent.startsWith("by ")) {
                        showdownDayNode.textContent = translateMenu("by ") + showdownDayNode.textContent.replace("by ", "");
                    }
                    // Background name
                    else {
                        showdownDayNode.textContent = translateMenu(showdownDayNode.textContent);
                    }
                }
            })
        }
        // Other background
        else if (backgroundElement.tagName == "A")
        {
            backgroundElement.childNodes.forEach(function (creditsNode)
            {
                // Author name
                if (creditsNode.textContent && creditsNode.textContent.startsWith("background by ")) {
                    creditsNode.textContent = translateMenu("background by ") + creditsNode.textContent.replace("background by ", "");
                }
            })
        }
    })
}

function updatePopup(popupElement: Element)
{
    var firstChild = popupElement.firstChild as Element;

    if (firstChild?.tagName == "FORM")
    {
        var formChild = firstChild.firstChild as Element;
        
        // Team validation popup
        if (formChild?.getAttribute("style")?.includes("white-space:pre-wrap;word-wrap:break-word")) {
            updateValidatePopup(firstChild);
        }
        // Regular pop-up
        else {
            updateGenericPopup(firstChild);
        }
    }
    else if (firstChild?.tagName == "UL")
    {
        updateTeamPopup(firstChild);
    }
    else if (firstChild?.tagName == "P")
    {
        var firstContent = firstChild.firstChild as Element;

        // If the first children has a trainersprite class, it probably is the user options panel
        if (firstContent?.className == "trainersprite") {
            updateUserOptionsPopup(popupElement);
        }
        else {
            updateGenericPopup(popupElement);
        }
    }
}

function updateUserOptionsPopup(popupElement: Element)
{
    popupElement.childNodes.forEach(function (pNode) {
        pNode.childNodes.forEach(function (popupContentNode) {
            var popupContent = popupContentNode as Element;

            if (popupContent.textContent)
            {
                // Label title, just translate it
                if (popupContent.tagName == "STRONG")
                {
                    // The username is also in <strong> tag, so we don't translate it
                    if (!(popupContent.previousElementSibling?.tagName == "IMG")) {
                        popupContent.textContent = translateMenu(popupContent.textContent);
                    }
                }
                // Other options : buttons, dropdown lists, checkboxes
                else if (["LABEL", "BUTTON"].includes(popupContent.tagName)) {
                    popupContent.childNodes.forEach(function (labelContentNode) {
                        var labelContent = labelContentNode as Element;

                        if (labelContent.textContent)
                        {
                            // Raw text element, just translate it
                            if (!labelContent.tagName || labelContent.tagName == "BUTTON") {
                                labelContent.textContent = translateMenu(labelContent.textContent);
                            }
                            // Dropdown list, translate each option
                            else if (labelContent.tagName == "SELECT")
                            {
                                var selectElement = labelContent as HTMLSelectElement;

                                // Don't try to translate language or timestamps options
                                if (!["timestamps-lobby", "timestamps-pms", "language"].includes(selectElement.name)) {
                                    labelContent.childNodes.forEach(function (optionNode) {
                                        var optionElement = optionNode as Element;

                                        if (optionElement.tagName == "OPTION" && optionElement.textContent) {
                                            optionElement.textContent = translateMenu(optionElement.textContent);
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    })
}

function updateTeamPopup(ulElement: Element)
{
    ulElement.childNodes.forEach(function (liNode) {
        liNode.childNodes.forEach(function (teamNode) {
            var teamElement = teamNode as Element;

            // Group by folder checkbox, just translate the label
            if (teamElement.tagName == "STRONG" && teamElement.textContent) {
                teamElement.textContent = translateMenu(teamElement.textContent);
            }
            // Label parent, translate the child
            if (teamElement.tagName == "P") {
                var emElement = teamElement.firstChild as Element;

                if (emElement?.tagName == "EM" && emElement.textContent?.includes("You have no ")) {
                    emElement.textContent = translateMenu("You have no ") + translateMenu(" teams") 
                        + emElement.textContent.replace("You have no ", "").slice(0, - " teams".length)
                }
            }
            // Label, translate it
            if (teamElement.tagName == "H3" && teamElement.textContent) 
            {
                // Format/generation teams label, just translate "teams"
                if (teamElement.textContent.includes("[")) {
                    teamElement.textContent = translateTeamFormat(teamElement.textContent);
                }
                // Regular label, just translate it
                else {
                    teamElement.textContent = translateMenu(teamElement.textContent);
                }
            }
            // Button : could be a team, a folder, or a teambuilder link
            else if (teamElement.tagName == "BUTTON" && teamElement.textContent) {
                var teamButton = teamElement as HTMLButtonElement;

                switch (teamButton.name)
                {
                    // Folder name, only translate the default name
                    case "selectFolder":
                        if (teamElement.textContent == "(No Folder)") {
                            teamElement.textContent = translateMenu("(No Folder)")
                        }

                        break;

                    // Team name, only translate the default name
                    case "selectTeam":
                        teamElement.textContent = translatePokemonTeam(teamElement.textContent);
                        break;

                    // Regular label button, just translate it
                    case "moreTeams":
                        teamElement.textContent = translateMenu(teamElement.textContent);
                        break;

                    // Teambuilder link, just translate "teams" and alter the syntax
                    case "teambuilder":
                        teamElement.childNodes.forEach(function (teambuilderNode)
                        {
                            // Only translate the raw label
                            if (!(teambuilderNode as Element).tagName && teambuilderNode.textContent) {
                                teambuilderNode.textContent = translateTeamFormat(teambuilderNode.textContent);
                            }
                        })
                        
                        break;
                }
            }
        }) 
    })
}

function updateGenericPopup(popupElement: Element)
{
    popupElement.childNodes.forEach(function (pNode) {
        pNode.childNodes.forEach(function (popupContentNode) {
            var popupContent = popupContentNode as Element;

            // Raw text element
            if (popupContent.textContent && (!popupContent.tagName || ["STRONG", "SMALL", "EM"].includes(popupContent.tagName))) {
                popupContent.textContent = translateMenu(popupContent.textContent);
            }
            // Iterate in children in order to find raw text elements
            else {
                popupContent.childNodes.forEach(function (popupLabelNode) {
                    var popupLabel = popupLabelNode as Element;

                    if (popupLabel.textContent)
                    {
                        // Raw text element
                        if (!popupLabel.tagName || ["STRONG", "SMALL", "EM"].includes(popupLabel.tagName)) {
                            popupLabel.textContent = translateMenu(popupLabel.textContent);
                        }
                        // Span, search for raw text elements
                        else if (popupLabel.tagName == "SPAN") {
                            translateSpanElement(popupLabel);
                        }
                    }
                })
            }
        })
    })
}

function updateUserDetails(popupElement: Element)
{
    popupElement.childNodes.forEach(function (userdetailsNode)
    {
        var userdetailsElement = userdetailsNode as Element;

        // Room name : only translate menu label
        if (userdetailsElement.className == "rooms") {
            userdetailsNode.childNodes.forEach(function (detailsNode) {
                var detailsElement = detailsNode as Element;

                // Translate room menu label (not the room name itself)
                if (detailsElement.tagName == "EM" && detailsElement.textContent) {
                    detailsElement.textContent = translateMenu(detailsElement.textContent);
                }
            })
        }
        // User status
        else if (userdetailsElement.classList.contains("userstatus")) {
            userdetailsElement.childNodes.forEach(function (userstatusNode) {
                var userstatusElement = userstatusNode as Element;

                // Raw label
                if (!userstatusElement.tagName && userstatusElement.textContent) {
                    userstatusElement.textContent = translateMenu(userstatusElement.textContent);
                }
            })
        }
    })
}

function updateValidatePopup(pElement: Element)
{
    pElement.childNodes.forEach(function (popupNode) {
        var popupElement = popupNode as Element;

        // Only translate the element without a class
        if (!popupElement.className && popupElement.textContent)
        {
            // Pop-up could be a single menu message
            if (isValidEnglishMenu(popupElement.textContent)) {
                popupElement.textContent = translateMenu(popupElement.textContent);
            }
            // Unknown menu message : most likely the team validator
            else {
                var translatedValidator = "";
                var teamValidation = popupElement.textContent.split("\n");

                // Translate every teamValidation element
                for (var i = 0 ; i < teamValidation.length ; i++)
                {
                    if (teamValidation[i]) {
                        translatedValidator += translateRegexValidatorMessage(teamValidation[i])
                    }

                    if (i < teamValidation.length - 1) {
                        translatedValidator += "\n";
                    }
                }

                popupElement.textContent = translatedValidator;
            }
        }
    })
}

function updateVolumeElement(volumeElement: Element)
{
    // Translate <label> and <em> tags
    if (volumeElement.textContent && ["LABEL", "EM"].includes(volumeElement.tagName)) {
        volumeElement.textContent = translateMenu(volumeElement.textContent);
    }
}

function updateButtonBar(buttonElement: Element)
{
    // Iterate over list of buttons
    buttonElement.childNodes.forEach(function (buttonBarNode) {
        buttonBarNode.childNodes.forEach(function (buttonContentNode) {
            var buttonContent = buttonContentNode as Element;

            // Translate button labels
            if (buttonContent.textContent) {
                buttonContent.textContent = translateMenu(buttonContent.textContent);
            }
        })
    })
}

function translateTeamFormat(teamFormat: string)
{
    if (/^\[.*\] (.*) teams$/.test(teamFormat))
    {
        // Retrieve gen number and format
        var gen = teamFormat.split("] ")[0] + "] ";
        var format = teamFormat.replace(" teams", "").replace(gen, "");

        return gen + "Équipes " + format;
    } 
    // Wrong format, just return the original string
    else {
        return teamFormat;
    }
}

function translateSpanElement(spanElement: Element)
{
    spanElement.childNodes.forEach(function (spanContentNode) {
        var spanContent = spanContentNode as Element;

        // Raw text element, just translate it
        if (!spanContent.tagName && spanContent.textContent) {
            spanContent.textContent = translateMenu(spanContent.textContent);
        }
        // Other tag, search for text content
        else {
            translateSpanElement(spanContent);
        }
    })
}
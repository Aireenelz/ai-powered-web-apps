// Constants
const feedbackDisplayTime = 3000

// Element selectors
const textInputArea = document.getElementById('text-input-area')
const summaryLengthContainer = document.getElementById('summary-length-container')
const summaryLengthInput = document.getElementById('summary-length-input')
const summaryLengthText = document.getElementById('summary-length-text')
const summarizeButton = document.getElementById('summarize-button')
const summaryContent = document.getElementById('summary-content')
const summaryOutputArea = document.getElementById('summary-output-area')
const copyButton = document.getElementById('copy-button')
const clearButton = document.getElementById('clear-button')
const loadingSection = document.getElementById('loading-section')
const errorSection = document.getElementById('error-section')
const errorMessage = document.getElementById('error-message')
const dismissErrorButton = document.getElementById('dismiss-error-button')

// Button event listeners
summarizeButton.addEventListener('click', summarize)
copyButton.addEventListener('click', copy)
clearButton.addEventListener('click', clear)
dismissErrorButton.addEventListener('click', dismissError)

// Other event listeners
document.addEventListener('DOMContentLoaded', focusOnTextInputArea)
textInputArea.addEventListener('input', scrollTextAreaToTopAndEnableControls)
summaryLengthInput.addEventListener('input', updateSummaryLengthText)

// Button event handlers
async function summarize() {
    startLoading();
    const text = textInputArea.value;
    const summaryLength = summaryLengthInput.value

    try {
        const response = await fetch('http://localhost:3000/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, summaryLength })
        });

        // Parse json response
        const data = await response.json()
        // Check for errors in the response
        if(data.error) {
            throw new Error(data.error);
        }
        // Log data to web console
        console.log("Text: ", text)
        console.log("Summary length: ", summaryLength)
        console.log(data)

        endLoading()
        enableCopyButton()

        summaryOutputArea.value = data.choices[0].message.content
    } catch (error) {
        handleError(error)
    }
}

async function copy() {
    try {
        await navigator.clipboard.writeText(summaryOutputArea.value)
        showCopyFeedback('Text copied!', 'success')
    } catch (err) {
        showCopyFeedback('Failed to copy.', 'failure')
    }
}

function clear() {
    clearTextInputArea()
    clearSummaryOutputArea()
    enableTextInputArea()
    focusOnTextInputArea()
    disableAllControls()
}

function dismissError() {
    hideErrorSection()
    displaySummaryContent()
    clear()
}

// Other event handlers
function focusOnTextInputArea() {
    textInputArea.focus()
}

function scrollTextAreaToTopAndEnableControls() {
    scrollTextAreaToTop()
    enableControls()
}

function updateSummaryLengthText() {
    summaryLengthText.textContent = `Summary Length: ${summaryLengthInput.value} words`
}

// Helper functions
function scrollTextAreaToTop() {
    setTimeout(() => {
        textInputArea.scrollTop = 0
    }, 0)
}

function enableControls() {
    if (textInputArea.value.trim() !== '') {
        enableSummaryLengthContainer()
        enableSummaryLengthInput()
        enableSummarizeButton()
        enableClearButton()
    } else {
        disableAllControls()
    }
}

function disableAllControls() {
    disableSummaryLengthContainer()
    disableSummaryLengthInput()
    disableSummarizeButton()
    disableSummaryOutputArea()
    disbaleClearButton()
    disableCopyButton()
}

function startLoading() {
    hideSummaryContent()
    displayLoadingSection()
}

function endLoading() {
    hideLoadingSection()
    displaySummaryContent()
}

function handleError(error) {
    endLoading()
    disableTextInputArea()
    disableAllControls()
    hideSummaryContent()
    setErrorMessageText(`There was an error processing the text: ${error.message}`)
    displayErrorSection()
}

function showCopyFeedback(message, status) {
    const feedbackClass = status === 'success' ? 'copied' : 'failed'
    addClassToCopyButton(feedbackClass)
    setCopyButtonText(message)
    setTimeout(() => {
        removeClassFromCopyButton(feedbackClass)
        setCopyButtonText('Copy')
    }, feedbackDisplayTime)
}

function focusOnCopyButton() {
    copyButton.focus()
}

function displaySummaryContent() {
    summaryContent.style.display = 'flex'
}

function displayLoadingSection() {
    loadingSection.style.display = 'flex'
}

function displayErrorSection() {
    errorSection.style.display = 'flex'
}

function hideLoadingSection() {
    loadingSection.style.display = 'none'
}

function hideErrorSection() {
    errorSection.style.display = 'none'
}

function hideSummaryContent() {
    summaryContent.style.display = 'none'
}

function enableTextInputArea() {
    textInputArea.disabled = false
}

function enableSummaryLengthContainer() {
    summaryLengthContainer.classList.remove('disabled')
}

function enableClearButton() {
    clearButton.disabled = false
}

function enableSummarizeButton() {
    summarizeButton.disabled = false
}

function enableSummaryLengthInput() {
    summaryLengthInput.disabled = false
}

function enableCopyButton() {
    copyButton.disabled = false
}

function enableSummaryOutputArea() {
    summaryOutputArea.disabled = false
}

function disableCopyButton() {
    copyButton.disabled = true
}

function disbaleClearButton() {
    clearButton.disabled = true
}

function disableSummaryOutputArea() {
    summaryOutputArea.disabled = true
}

function disableSummarizeButton() {
    summarizeButton.disabled = true
}

function disableSummaryLengthInput() {
    summaryLengthInput.disabled = true
}

function disableSummaryLengthContainer() {
    summaryLengthContainer.classList.add('disabled')
}

function disableTextInputArea() {
    textInputArea.disabled = true
}

function setErrorMessageText(text) {
    errorMessage.textContent = text
}

function setCopyButtonText(text) {
    copyButton.textContent = text
}

function clearTextInputArea() {
    textInputArea.value = ''
}

function clearSummaryOutputArea() {
    summaryOutputArea.value = ''
}

function removeClassFromCopyButton(className) {
    copyButton.classList.remove(className)
}

function addClassToCopyButton(className) {
    copyButton.classList.add(className)
}
function skillsMember() {
    let member = document.getElementById('member');
    let memberVal = member.options[member.selectedIndex].value;
    let memberText = member.options[member.selectedIndex].text;

    let memberInput = document.getElementById('memberInput');
    memberInput.value = memberVal;

    let memberTextInput = document.getElementById('memberTextInput');
    memberTextInput.value = memberText;
}
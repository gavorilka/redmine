var selectedTags = [];

function updateSelectedTags() {
    selectedTags = [];
    $('.checkbox_toggle_selection').each(function() {
        if ($(this).prop('checked')) {
            $(this).addClass('checked-checkbox');
            selectedTags.push($(this).val());
        } else {
            $(this).removeClass('checked-checkbox');
        }
    });
    toggleEditButtons();
    toggleDeleteIcons();
}

function updateSelectedTagsIssue() {
    selectedTags = [];
    $('.checkbox_toggle_selection_issue').each(function() {
        if ($(this).prop('checked')) {
            $(this).addClass('checked-checkbox');
            selectedTags.push($(this).val());
        } else {
            $(this).removeClass('checked-checkbox');
        }
    });
    toggleEditButtonsIssue();
    toggleDeleteIconsIssue();
}

function updateSelectedTagsProject() {
    selectedTags = [];
    $('.checkbox_toggle_selection_project').each(function() {
        if ($(this).prop('checked')) {
            $(this).addClass('checked-checkbox');
            selectedTags.push($(this).val());
        } else {
            $(this).removeClass('checked-checkbox');
        }
    });
    toggleEditButtonsProject();
    toggleDeleteIconsProject();
}

function updateSelectedTagsTime() {
    selectedTags = [];
    $('.checkbox_toggle_selection_time').each(function() {
        if ($(this).prop('checked')) {
            $(this).addClass('checked-checkbox');
            selectedTags.push($(this).val());
        } else {
            $(this).removeClass('checked-checkbox');
        }
    });
    toggleEditButtonsTime();
    toggleDeleteIconsTime();
}

function toggleEditButtonsIssue() {
    if (selectedTags.length > 1) {
        $('.icon-edit-issue').hide();
    } else {
        $('.icon-edit-issue').show();
    }
}

function toggleEditButtonsProject() {
    if (selectedTags.length > 1) {
        $('.icon-edit-project').hide();
    } else {
        $('.icon-edit-project').show();
    }
}

function toggleEditButtonsTime() {
    if (selectedTags.length > 1) {
        $('.icon-edit-time').hide();
    } else {
        $('.icon-edit-time').show();
    }
}

function toggleEditButtons() {
    if (selectedTags.length > 1) {
        $('.icon-edit').hide();
    } else {
        $('.icon-edit').show();
    }
}

function toggleDeleteIcons() {
    var checkboxesChecked = $('.checkbox_toggle_selection:checked').length > 1;
    $('.icon-del').each(function() {
        var checkbox = $(this).closest('tr').find('.checkbox_toggle_selection');
        if (checkboxesChecked && !checkbox.prop('checked')) {
            $(this).css({
                'pointer-events': 'none',
                'opacity': '0.5'
            });
        } else {
            $(this).css({
                'pointer-events': 'auto',
                'opacity': '1'
            });
        }
    });
}

function toggleDeleteIconsIssue() {
    var checkboxesChecked = $('.checkbox_toggle_selection_issue:checked').length > 1;
    $('.icon-del-issue').each(function() {
        var checkbox = $(this).closest('tr').find('.checkbox_toggle_selection_issue');
        if (checkboxesChecked && !checkbox.prop('checked')) {
            $(this).css({
                'pointer-events': 'none',
                'opacity': '0.5'
            });
        } else {
            $(this).css({
                'pointer-events': 'auto',
                'opacity': '1'
            });
        }
    });
}

function toggleDeleteIconsProject() {
    var checkboxesChecked = $('.checkbox_toggle_selection_project:checked').length > 1;
    $('.icon-del-project').each(function() {
        var checkbox = $(this).closest('tr').find('.checkbox_toggle_selection_project');
        if (checkboxesChecked && !checkbox.prop('checked')) {
            $(this).css({
                'pointer-events': 'none',
                'opacity': '0.5'
            });
        } else {
            $(this).css({
                'pointer-events': 'auto',
                'opacity': '1'
            });
        }
    });
}

function toggleDeleteIconsTime() {
    var checkboxesChecked = $('.checkbox_toggle_selection_time:checked').length > 1;
    $('.icon-del-time').each(function() {
        var checkbox = $(this).closest('tr').find('.checkbox_toggle_selection_time');
        if (checkboxesChecked && !checkbox.prop('checked')) {
            $(this).css({
                'pointer-events': 'none',
                'opacity': '0.5'
            });
        } else {
            $(this).css({
                'pointer-events': 'auto',
                'opacity': '1'
            });
        }
    });
}

$(document).ready(function() {
    function showContextMenu(x, y) {
        var lang = $('html').attr('lang');
        var destroyText = (lang === 'ar') ? 'تدمير' : 'Delete';
        if ($('.list.issues')) {
            $('#context-menu').remove();
            var contextMenu = $('<div>').attr('id', 'context-menu');
            var ulList = $('<ul>'); 
            var listItem = $('<li>').addClass('icon icon-del destroy-tag').text(destroyText).click(function() {
                var element = $('a[data-tag-id="' + selectedTags[0] + '"]');
                if (element.hasClass('icon-edit-time')) {
                    destroyTags(selectedTags, 'time_entry');
                } else if (element.hasClass('icon-edit-project')) {
                    destroyTags(selectedTags, 'project');
                } else {
                    destroyTags(selectedTags, 'issue');
                }
            });
            ulList.append(listItem); 
            contextMenu.append(ulList);
            $('body').append(contextMenu);
    
            var menuWidth = contextMenu.outerWidth();
            var menuHeight = contextMenu.outerHeight();
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var scrollTop = $(window).scrollTop();
            var scrollLeft = $(window).scrollLeft();
            if (x + menuWidth > windowWidth + scrollLeft) {
                x = windowWidth + scrollLeft - menuWidth - 10;
            }
            if (y + menuHeight > windowHeight + scrollTop) {
                y = windowHeight + scrollTop - menuHeight - 10; // 10px padding from the edge
            }
    
            contextMenu.css({
                top: y + 'px',
                left: x + 'px'
            });
        }
    }    

    $('.checkbox_toggle_selection_issue').on('click', function(e) {
        updateSelectedTagsIssue();
    });
    $('.checkbox_toggle_selection_time').on('click', function(e) {
        updateSelectedTagsTime();
    });
    $('.checkbox_toggle_selection_project').on('click', function(e) {
        updateSelectedTagsProject();
    });

    window.delete_tag = function(tag_id, tab) {
        if (selectedTags.length == 0) {
            destroyTags([tag_id], tab);
        } else {
            destroyTags(selectedTags, tab);
        }
    }

    $(document).on('contextmenu', function(e) {
        if ($(e.target).hasClass('checked-checkbox')) {
            console.log("demoworof")
            e.preventDefault();
            console.log(e.pageX,e.pageY,'sksksk')
            showContextMenu(e.pageX, e.pageY);
        }
    });

    $(document).on('click', function(e) {
        if (!$(e.target).closest('#context-menu').length) {
            $('#context-menu').remove();
        }
    });
});

function destroyTags(selectedTags, tab) {
        var url = window.location.origin;
        $.ajax({
            url: url + '/tags',
            method: 'DELETE',
            data: { tag_ids: selectedTags, tab: tab },
            success: function(response) {
                // Handle success response
            },
            error: function(xhr, status, error) {
                // Handle error response
            }
        });
}

function tagsCheckboxIssue() {
    var toggleCheckbox = document.getElementById('toggle-checkbox-issue');
    var checkboxes = document.querySelectorAll('.checkbox_toggle_selection_issue');
    var shouldCheck = !toggleCheckbox.checked;

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = shouldCheck;
    });

    toggleCheckbox.checked = shouldCheck;
    updateSelectedTagsIssue();
}

function tagsCheckboxProject() {
    var toggleCheckbox = document.getElementById('toggle-checkbox-project');
    var checkboxes = document.querySelectorAll('.checkbox_toggle_selection_project');
    var shouldCheck = !toggleCheckbox.checked;

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = shouldCheck;
    });

    toggleCheckbox.checked = shouldCheck;
    updateSelectedTagsProject();
}

function tagsCheckboxTime() {
    var toggleCheckbox = document.getElementById('toggle-checkbox-time');
    var checkboxes = document.querySelectorAll('.checkbox_toggle_selection_time');
    var shouldCheck = !toggleCheckbox.checked;

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = shouldCheck;
    });

    toggleCheckbox.checked = shouldCheck;
    updateSelectedTagsTime();
}

function validateKeyPress(event) {
    const regex = /^[a-zA-Z0-9\s]*$/;
    const key = String.fromCharCode(event.which);
    if (!regex.test(key)) {
        event.preventDefault();
        return false
    }
    return true;
}

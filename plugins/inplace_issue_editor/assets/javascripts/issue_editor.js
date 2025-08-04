
/********* Issue Editor **********/ 

var url_https = url_https || false;
var edit_icon = edit_icon || "single";
var event_value = event_value || "click";
var type_icon = type_icon || "none";
var target_value = target_value || "value";
var excluded_field_id = excluded_field_id || [];
var check_update_conflict = check_update_conflict || false;


var LOCATION_HREF = typeof custom_location_href !== 'undefined' ? custom_location_href : window.location.href.split('?')[0];

var svg_pencil = `<svg width="12" height="14" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.6045 5.2808L17.8579 7.02704L13.8584 3.02715L15.6613 1.22427C16.112 0.773551 16.9568 0.773551 17.4642 1.22427L19.7173 3.47742C20.1114 3.98472 20.1114 4.77339 19.6045 5.28069L19.6045 5.2808Z" fill="#1D273C"/>
<path d="M1.46498 15.4773C3.15509 16.3221 4.56343 17.7304 5.40823 19.3644L0 20.8855L1.46498 15.4773ZM6.25313 18.6319C5.35171 16.9418 3.94336 15.4773 2.25325 14.632L13.0693 3.81592L17.0692 7.81581L6.25313 18.6319Z" fill="#1D273C"/>
</svg>`;


if (url_https) {
	LOCATION_HREF = LOCATION_HREF.replace(/^http:\/\//i, 'https://');
}


const updateCSRFToken = function(token){
	document.querySelectorAll('input[name="authenticity_token"]').forEach((elt) => elt.value = token);
	document.querySelector('meta[name="csrf-token"]').setAttribute("content", token);
}

const setCSRFTokenInput = function(token){
	document.querySelectorAll('form[method="post"]').forEach((elt) => {
		if(!elt.querySelectorAll('input[name="authenticity_token"]').length){
			const input = document.createElement("input");
			input.setAttribute("type", "hidden");
			input.setAttribute("name", "authenticity_token");
			input.value = token;
			elt.insertBefore(input, null);
		}
	});
}


var getEditFormHTML = function(attribute){
	let formElement =  document.querySelector('#issue_' + attribute + "_id");
	formElement = formElement ? formElement : document.querySelector('#issue_' + attribute);
	formElement = formElement ? formElement : document.querySelector('#' + attribute);
   
	// Checkbox specific case
	let is_checkboxes = false;
	let is_file = false;
	let is_list = false;
	let CF_ID = false;
	if(!formElement && attribute.startsWith("custom_field_values_")){
		CF_ID = attribute.split("custom_field_values_")[1];
		/* Is it a checkbox block ? */
		formElement = document.querySelector('#issue_custom_field_values_' + CF_ID);
		if(formElement){
			formElement = formElement.closest('.check_box_group');
			is_checkboxes = CF_ID;
		} else {
			/* Is it a file block ? */
			formElement = document.querySelector('#issue_custom_field_values_' + CF_ID + '_blank');
			if(formElement){
				formElement = formElement.closest('p');
				formElement.removeChild(formElement.querySelector('label'));
				is_file = CF_ID;
			} else {
				/* Is it a checkbox/radio group ? */
				formElement = document.querySelector('#issue-form .cf_' + CF_ID + '.check_box_group');
				is_list = CF_ID;
			}
		}
	}
    // for storypoint and sprint
	if (attribute === "sprint_value") {
        const sprintSelect = document.querySelector('select[name="issue[sprint_craft]"]');
        if (!sprintSelect) return null;
        const selectElement = sprintSelect.cloneNode(true);
       
        selectElement.addEventListener('change', function(e){
            sendData([{ "name": selectElement.getAttribute('name'), "value": selectElement.value }]);
        });
        const wrapper = document.createElement('div');
        wrapper.classList.add('issueEdit');
        wrapper.appendChild(selectElement);
   
        return wrapper;
    }

	if (attribute === "story_point_value") {
		const storySelect = document.querySelector('select[name="issue[story_points]"]');
		if (!storySelect) return null;
		const selectElement = storySelect.cloneNode(true);
		selectElement.addEventListener('change', function(e){
			sendData([{ "name": selectElement.getAttribute('name'), "value": selectElement.value }]);
		});
		const wrapper = document.createElement('div');
		wrapper.classList.add('issueEdit');
		wrapper.appendChild(selectElement);
		return wrapper;
	}	
	// for storypoint and sprint end

	if(formElement){
		const clone = formElement.cloneNode(true);
		
		if(clone.matches('select') && !clone.hasAttribute('multiple')) {
			clone.addEventListener('change', function(e){
				sendData([{"name" : clone.getAttribute('name'), "value" : clone.value}]);
			});
		}
		if(clone.matches('input')){
			
			clone.addEventListener("keydown", function(event) {
				if (event.key === "Enter") {
					sendData([{"name" : clone.getAttribute('name'), "value" : clone.value}]);
					clone.blur();
				}
			});
		}
		if(clone.matches('textarea')) {
			clone.setAttribute('rows', '4'); // Set your desired number of rows
			clone.setAttribute('cols', '35');
			clone.addEventListener("keydown", function(event) {
				if (event.key === "Enter") {
					// event.preventDefault();
					sendData([{"name" : clone.getAttribute('name'), "value" : clone.value}]);
					clone.blur();
				}
			});
		}
		if(clone.matches('input[type="date"]')) {
			clone.addEventListener('change', function() {
				sendData([{"name" : clone.getAttribute('name'), "value" : clone.value}]);
			});
		}
		if(is_checkboxes || is_file || is_list) {
			clone.setAttribute('id', "issue_custom_field_values_" + CF_ID + "_dynamic");
		} else {
			clone.setAttribute('id', formElement.getAttribute('id') + "_dynamic");
		}
		const wrapper = document.createElement('div');
		wrapper.classList.add('issueEdit');
		wrapper.insertBefore(clone, null);
		return wrapper;  
	}

	return null;
}


const cloneEditForm = function(){
	$('#ajax-indicator').show(); 
	const wrapper = document.createElement('form');
	wrapper.setAttribute('id', 'fakeDynamicForm');
	const issueDetails = document.querySelector('.issue.details');

	if (issueDetails) {
		issueDetails.parentNode.insertBefore(wrapper, issueDetails);
		wrapper.appendChild(issueDetails);
	}
    
	document.querySelectorAll('div.issue.details .attribute').forEach(function(elt){
		const classList = elt.classList.value.split(/\s+/);

		let attributes = classList.filter(function(elem) { return elem != "attribute"; });
		
		attributes = attributes.map((attr) => attr.replaceAll('-', '_'));

		let custom_field = false;
		attributes.forEach(function(part, index, arr) {
		  if(arr[index] === "progress") arr[index] = "done_ratio";
		  if(arr[index].startsWith('cf_')) {
		  	arr[index] = arr[index].replace('cf', 'custom_field_values');
		  	custom_field = arr[index];
		  }
		});

		attributes = attributes.join(" ");

		let selected_elt = custom_field ? custom_field : attributes;
		if(attributes && !excluded_field_id.includes(selected_elt)){
			let dynamicEditField = getEditFormHTML(selected_elt);
			if (dynamicEditField) {
				let btn_edit = document.createElement('span');
				btn_edit.classList.add('iconEdit');
				btn_edit.innerHTML = svg_pencil;
				if (elt.querySelector('.value')) {
				  let valueElement = elt.querySelector('.value');
				  valueElement.insertBefore(btn_edit, null);
				  valueElement.insertBefore(dynamicEditField, null);
				}
			}
		}
  	});

   
	let sprintElement = document.querySelector('.sprint_value');
	  if (sprintElement && !excluded_field_id.includes("sprint")) {
		
		  let existingEditForm = sprintElement.querySelector('.issueEdit');
		  if (!existingEditForm) {
			  let dynamicSprintField = getEditFormHTML("sprint_value");
			  if (dynamicSprintField) {
				  let btn_edit = document.createElement('span');
				  btn_edit.classList.add('iconEdit');
				  btn_edit.innerHTML = svg_pencil;
				  sprintElement.insertBefore(dynamicSprintField, null);
                  sprintElement.insertBefore(btn_edit, sprintElement.lastChild);
			  }
		  }
	  }

	let storyPointElement = document.querySelector('.story_point_value');
		if (storyPointElement && !excluded_field_id.includes("story_point")) {
			
			let existingEditForm = storyPointElement.querySelector('.issueEdit');
			if (!existingEditForm) {
				
				let dynamicStoryPointField = getEditFormHTML("story_point_value");
				if (dynamicStoryPointField) {
					let btn_edit = document.createElement('span');
					btn_edit.classList.add('iconEdit');
					btn_edit.innerHTML = svg_pencil;
					storyPointElement.insertBefore(dynamicStoryPointField, null);
					storyPointElement.insertBefore(btn_edit, storyPointElement.lastChild);
				}
			}
		}

  	
  	if(!excluded_field_id.includes("description") && document.querySelectorAll('div.issue.details .description').length){
		const btn_edit = document.createElement('span');
		btn_edit.classList.add('iconEdit');
		btn_edit.innerHTML = svg_pencil;
  		document.querySelector('div.issue.details .description > p strong').insertAdjacentElement("afterend", btn_edit);
  		const formDescription = getEditFormHTML("description");
  	}

  	
  	if(!excluded_field_id.includes("issue_subject")){

		const btn_edit = document.createElement('span');
		btn_edit.classList.add('iconEdit');
		btn_edit.innerHTML = svg_pencil;
		const subjectHeader = document.querySelector('div.issue.details div.subject h3');
		if (subjectHeader) {
			subjectHeader.insertBefore(btn_edit, null);
		}
  		const formTitle = getEditFormHTML("issue_subject");
		  const subjectDiv = document.querySelector('div.issue.details div.subject');
		  if (subjectDiv) {
			  subjectDiv.insertBefore(formTitle, null);
		  }
  	}
	  $('#ajax-indicator').hide(); 
}

document.querySelector('body').addEventListener(event_value, function(e){
    let is_attribute = e.target.matches('div.issue.details .attributes .attribute .' + target_value) || e.target.closest('div.issue.details .attributes .attribute .' + target_value);
    let is_description = e.target.matches('div.issue.details div.description > p') || e.target.closest('div.issue.details div.description > p');
    let is_subject = e.target.matches('div.issue.details div.subject') || e.target.closest('div.issue.details div.subject');
    let is_sprint = e.target.matches('div.issue.details .sprint_value') || e.target.closest('div.issue.details .sprint_value');//for sprint
	let is_story_point = e.target.matches('.story_point_value') || e.target.closest('.story_point_value'); //for story point
    
    
    if(is_attribute || is_description || is_subject || is_sprint){
        if(e.target.closest('.issueEdit')) return; 
        document.querySelectorAll('.issueEdit').forEach(function(elt){ elt.classList.remove('open'); });
        if(!e.target.closest('a') && !e.target.closest('button')){
            let selector = e.target.closest('.value');
            if(is_description) selector = e.target.closest('.description');
            if(is_subject) selector = e.target.closest('.subject');
            if(is_sprint) selector = e.target.closest('.sprint_value');
			if(is_story_point) selector = e.target.closest('.story_point_value'); 
            if(selector.querySelector('.issueEdit')) {
                selector.querySelector('.issueEdit').classList.add('open');
            }
        }
    }
});

document.querySelector('body').addEventListener(type_icon, function(e){
    let is_attribute = e.target.matches('div.issue.details .attributes .attribute .' + target_value) || e.target.closest('div.issue.details .attributes .attribute .' + target_value);
    let is_description = e.target.matches('div.issue.details div.description > p') || e.target.closest('div.issue.details div.description > p');
    let is_subject = e.target.matches('div.issue.details div.subject') || e.target.closest('div.issue.details div.subject');
    let is_sprint = e.target.matches('div.issue.details .sprint_value') || e.target.closest('div.issue.details .sprint_value');//for sprint
	let is_story_point = e.target.matches('.story_point_value') || e.target.closest('.story_point_value'); //for story point
    
    if(e.target.matches('.iconEdit') || e.target.closest('.iconEdit')){
        document.querySelectorAll('.issueEdit').forEach(function(elt){ elt.classList.remove('open'); });
        let selector = e.target.closest('.value');
        if(is_description) selector = e.target.closest('.description');
        if(is_subject) selector = e.target.closest('.subject');
        if(is_sprint) selector = e.target.closest('.sprint_value');
		if(is_story_point) selector = e.target.closest('.story_point_value'); 
        selector.querySelector('.issueEdit').classList.add('open');
    }
});



document.querySelector('body').addEventListener('click', function(e){
	if(e.target.matches('.refreshData') || e.target.closest('.refreshData')){
		e.preventDefault();
		sendData();
	}
});

document.onkeydown = function(evt) {
    evt = evt || window.event;
    let isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        document.querySelectorAll('.issueEdit').forEach(function(elt){ elt.classList.remove('open'); });
    }
};

const getVersion = function(callback){
	fetch(LOCATION_HREF, {
		method: 'GET',
		crossDomain: true,
	}).then(res => res.text()).then(data => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(data, 'text/html');
		const distant_version = doc.querySelector('#issue_lock_version').value;
		if(callback) callback(distant_version);
		return distant_version;
	}).catch(err => {
		console.warn('Issue while trying to get version (avoiding conflict)');
		console.log(err);
	});
}

let loadedDate = new Date();
const checkVersion = function(callback){

	fetch(LOCATION_HREF + ".json", {
		method: 'GET',
		crossDomain: true,
	}).then(res => res.text()).then(data => {
		try {
			const parsedData = JSON.parse(data);
			const lastUpdate = new Date(parsedData.issue.updated_on);
			if(lastUpdate > loadedDate){
				loadedDate = lastUpdate;
				if(!document.querySelectorAll('#content .conflict').length){
					let msg = document.createElement('div');
					msg.classList.add('conflict');
					msg.innerHTML = `${_TXT_CONFLICT_TITLE}
					<div class="conflict-details">
					<div class="conflict-journal">
					<p><a href='#' onClick="window.location.href=window.location.href">${_TXT_CONFLICT_LINK}</a> <strong>${_TXT_CONFLICT_TXT}</strong></p>
					</div>
					</div>`
					document.querySelector('#content').insertBefore(msg, document.querySelector('#content').firstChild);
				}
				if(callback) getVersion(callback);
			} else {
				if(callback) callback(parseInt(document.querySelector('#issue_lock_version').value));
			}
		} catch (e) {
			throw new Error('Error occured: ', e);
		}
		
	}).catch(err => {
		console.warn('Issue while trying to get version (avoiding conflict)');
		console.log(err);
	});
}




/* Global function to perform AJAX call */
let sendData = function(serialized_data){
    let updateIssue = function(serialized_data){
        const token = document.querySelector("meta[name=csrf-token]").getAttribute('content');
        let params = serialized_data || [];
        params.push({name: '_method', value: "patch"});
        params.push({name: 'authenticity_token', value: token});

        let request = new XMLHttpRequest();
        request.open('POST', LOCATION_HREF, true);
        let formData = new FormData();
        params.forEach(data => {
            if (data.name === 'issue[story_points]' && (data.value === "" || data.value === "0")) {
                data.value = ""; // Set blank option to empty string
            }
            formData.append(data.name, data.value);
        });
		$('#ajax-indicator').show(); 
        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if(this.status == 200) {
					
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(this.responseText, 'text/html');

                    let error = doc.querySelector("#errorExplanation");
                    if(error){
                        // Handle error
                        if (!document.querySelector("#errorExplanation")) {
                            let err_div = document.createElement('div');
                            err_div.setAttribute("id", "errorExplanation");
                            err_div.innerHTML = error.innerHTML;
                            document.querySelector('.issue.details').insertAdjacentElement("beforebegin", err_div);
                            location.href = "#";
                            location.href = "#errorExplanation";
                        } else {
                            document.querySelector("#errorExplanation").innerHTML = error.innerHTML;
                        }
                        fetch(LOCATION_HREF, {
                            method: 'GET',
                            crossDomain: true,
                        }).then(res => res.text()).then(data => {
                            const parser = new DOMParser();
                            return parser.parseFromString(data, 'text/html');
                        });
                    } else {
                        if(document.querySelector("#errorExplanation")) document.querySelector("#errorExplanation").remove();
                    }

                    document.querySelector('form#issue-form').innerHTML = doc.querySelector('form#issue-form').innerHTML;
                    document.querySelector('#all_attributes').innerHTML = doc.querySelector('#all_attributes').innerHTML;
                    if(document.querySelector('div.issue.details')){
                        document.querySelector('div.issue.details').innerHTML = doc.querySelector('div.issue.details').innerHTML;
                    }
                    if(document.querySelector('#tab-content-history')) {
                        document.querySelector('#tab-content-history').appendChild(doc.querySelector('#history .journal.has-details:last-child'));
                    }
                    document.querySelector('#issue_lock_version').value = doc.querySelector("#issue_lock_version").value;
					$('#ajax-indicator').show();
                    cloneEditForm();
					
// ====================tag plugin exit condition ================

if (document.querySelector('#tag_script_rerun')) {
    const scriptContainer = document.querySelector('#tag_script_rerun');
    const scripts = scriptContainer.querySelectorAll('script');

    if (scripts.length === 2) {
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript); 
        });
    }
}

	  

// ==============================================================
                    if (document.querySelector('input[type=date]') && 
                        $('body').find('input[type=date]').datepickerFallback instanceof Function &&
                        typeof datepickerOptions !== 'undefined') {
                        $('body').find('input[type=date]').datepickerFallback(datepickerOptions);
                    }
					$.getScript("/plugin_assets/inplace_issue_editor/javascripts/description.js")
					.done(function() {
						$('#ajax-indicator').hide();
					})
					.fail(function(jqxhr, settings, exception) {
						console.error("Script loading failed: ", exception);
						$('#ajax-indicator').hide();
					});
                    setCSRFTokenInput(doc.querySelector('input[name="authenticity_token"]').value);
                    updateCSRFToken(doc.querySelector('input[name="authenticity_token"]').value);
                    loadedDate = new Date();
                } else {
                    callError(this.status);
                }
            }
        };
        request.send(formData);
    }
    if(check_update_conflict){
        checkVersion(function(distant_version){
            if(distant_version == document.querySelector('#issue_lock_version').value){
                updateIssue(serialized_data);
            } else {
                // Handle conflict scenario
            }
        });
    } else {
        updateIssue(serialized_data);
    }
}



cloneEditForm();
setCSRFTokenInput(document.querySelector('meta[name="csrf-token"]').getAttribute("content"));
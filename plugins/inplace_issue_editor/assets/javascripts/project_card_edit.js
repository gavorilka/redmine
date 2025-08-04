$(document).ready(function () {
  $('#content').addClass('inplace_class');
  if ($("body").hasClass("controller-projects")) {
    const customDetailsDivs = document.querySelectorAll(".custom-details");
    for (let i = 0; i < customDetailsDivs.length; i++) {
      const customDetailsDiv = customDetailsDivs[i];
      const childDivs = customDetailsDiv.querySelectorAll("div");
      for (let j = 0; j < childDivs.length; j++) {
        const div = childDivs[j];
        const classes = div.className.split(" ");
        const className = classes[classes.length - 1];
        const valueName = classes[0];
        const tooltip = getTooltipText(className, valueName);
        div.setAttribute("title", tooltip);
      }
    }
    function getTooltipText(className, valueName) {
      switch (className) {
        case "string":
          return removeDash(valueName);
        case "int":
          return removeDash(valueName);
        case "link":
          return removeDash(valueName);
        case "list":
          return removeDash(valueName);
        case "user":
          return removeDash(valueName);
        case "version":
          return removeDash(valueName);
        case "date":
          return removeDash(valueName);
        case "float":
          return removeDash(valueName);
        case "bool":
          return removeDash(valueName);
        case "file":
          return removeDash(valueName);
        case "key":
          return removeDash(valueName);
        case "text":
          return removeDash(valueName);
        case "attachment":
          return removeDash(valueName);
        case "enumeration":
          return removeDash(valueName);
        default:
          return "";
      }
    }

    function removeDash(value) {
      return value.replace(/-/g, " ");
    }

    var pageConditionElementBlock = document.querySelector(
      ".controller-projects.action-index #projects-index"
    );
    var project_api_key = localStorage.getItem("issue_table_api_key");
    if (pageConditionElementBlock) {
      var url = window.location.origin;
      var svg_pencils = `<svg width="12" height="14" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M19.6045 5.2808L17.8579 7.02704L13.8584 3.02715L15.6613 1.22427C16.112 0.773551 16.9568 0.773551 17.4642 1.22427L19.7173 3.47742C20.1114 3.98472 20.1114 4.77339 19.6045 5.28069L19.6045 5.2808Z" fill="#1D273C"/>
       <path d="M1.46498 15.4773C3.15509 16.3221 4.56343 17.7304 5.40823 19.3644L0 20.8855L1.46498 15.4773ZM6.25313 18.6319C5.35171 16.9418 3.94336 15.4773 2.25325 14.632L13.0693 3.81592L17.0692 7.81581L6.25313 18.6319Z" fill="#1D273C"/>
       </svg>`;
      var parentContainerBlock = document.querySelector(
        ".controller-projects.action-index #projects-index"
      );
      if (parentContainerBlock) {
        var trackerBlock = parentContainerBlock.querySelectorAll(
          "div a.project, div.custom-details div:not(.project-members, .issues-info, .issues-info .progress-bar, .issues-info .progress-bar .progress, .issues-info .progress-bar .progress ,.issues-info .progress-bar .progress .progress-bar-closed, .issues-info .progress-bar .progress .progress_result)"
        );
        trackerBlock.forEach(function(a) {
          var divText = a.textContent.trim();
          var spanElement = document.createElement("span");
          spanElement.classList.add("div_text");
          spanElement.textContent = divText;
          a.innerHTML = "";
          a.appendChild(spanElement);
          var editIssueSpan = document.createElement("span");
          editIssueSpan.classList.add("edit-issue");
          editIssueSpan.innerHTML = svg_pencils;
          editIssueSpan.style.display = "none";
          a.appendChild(editIssueSpan);
      });      
      }
      function createEditIssueSpan() {
        var editIssueSpan = document.createElement("span");
        editIssueSpan.classList.add("edit-issue");
        editIssueSpan.innerHTML = svg_pencils;
        editIssueSpan.style.display = "none";
        return editIssueSpan;
      }
      function addErrorDiv(responseText) {
        if ($('#errorExplanation').length) {
            $('#errorExplanation').remove();
        }
        var response = JSON.parse(responseText);
        var errorMessage = response.errors;
        var $errorExplanation = $('<div>', {
            id: 'errorExplanation'
        });
        if (Array.isArray(errorMessage)) {
            var $errorList = $('<ul>');
            errorMessage.forEach(function(error) {
                $errorList.append($('<li>').text(error));
            });
            $errorExplanation.html($errorList);
        } else {
            $errorExplanation.html(errorMessage);
        }
        $errorExplanation.insertBefore('.contextual:first');
        setTimeout(function() {
          $('#errorExplanation').fadeOut();
      }, 4000);
      }        
      function showEditIssueIcon(element) {
        if (permissionstatus === "true") {
          if (!element.find(".testInput").is(":visible")) {
            element.find(".edit-issue").css("display", "inline-block");
          }
        }
      }
      function hideEditIssueIcon(element) {
        element.find(".edit-issue").css("display", "none");
      }
      $("a.project.root.leaf , a.project.root.parent").hover(
        function () {
          if (
            !$(this).find(".testInput").is(":focus") &&
            permissionstatus === "true"
          ) {
            showEditIssueIcon($(this));
          }
        },
        function () {
          if (!$(this).find(".testInput").is(":focus")) {
            hideEditIssueIcon($(this));
          }
        }
      );
      $("a.project.child").hover(
        function () {
          if (
            !$(this).find(".testInput").is(":focus") &&
            permissionstatus === "true"
          ) {
            showEditIssueIcon($(this));
          }
        },
        function () {
          if (!$(this).find(".testInput").is(":focus")) {
            hideEditIssueIcon($(this));
          }
        }
      );
      $(".testInput")
        .on("mouseenter", function () {
          $(this).prev(".edit-issue").css("display", "block");
        })
        .on("mouseleave", function () {
          if (!$(this).is(":focus")) {
            $(this).prev(".edit-issue").css("display", "inline-block");
          }
        });
      $("a.project.root.leaf , a.project.root.parent")
        .on("focus", "input.testInput", function () {
          hideEditIssueIcon(
            $(this).closest(
              "a.project.root.leaf, a.project.root.parent"
            )
          );
        })
        .on("blur", "input.testInput", function () {
          hideEditIssueIcon(
            $(this).closest(
              "a.project.root.leaf , a.project.root.parent"
            )
          );
        });
      $(
        "div.custom-details div:not(.project-members, .issues-info, .progress, .progress_result, .progress-bar,.progress-bar-closed, .enumeration , .attachment)"
      ).hover(
        function () {
          if (
            !$(this).find(".testInput").is(":focus") &&
            permissionstatus === "true"
          ) {
            if($(this).hasClass('no-tooltip')){
              if($(this).find('.testInput').length){
                $(this).removeClass('no-tooltip')
              }
              $(this).removeClass('no-tooltip')
            }
            showEditIssueIcon($(this));
          }
        },
        function () {
          if (!$(this).find(".testInput").is(":focus")) {
            hideEditIssueIcon($(this));
          }
        }
      );
      $("div.custom-details")
        .on("focus", "input.testInput", function () {
          hideEditIssueIcon($(this).closest("div.custom-details"));
        })
        .on("blur", "input.testInput", function () {
          hideEditIssueIcon($(this).closest("div.custom-details"));
        });
      $(document).on("click", "#dynamic-edit-project-name", function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
      $(document).on("click", ".edit-issue", function (e) {
        e.preventDefault();
        var parentDiv = $(this).closest(".project");
        var projectNameSpan = parentDiv.find(".div_text");
        var projectNameText = projectNameSpan.text();
        var parentLi = $(this).closest("li");
        var projectLink = parentLi.find("a.project").attr("href");
        var parts = projectLink.split("/");
        var projectDisplayId = parts[parts.length - 1];
        // Hide all other input fields
        $(".testInput")
          .not(parentDiv.find(".testInput"))
          .css("display", "none")
          .siblings(".div_text")
          .show();
        $(".edit-issue").not($(this)).hide();
        // Hide edit icon and text span
        $(this).css("display", "none");
        projectNameSpan.css("display", "none");
        var inputField = parentDiv.find(".testInput");
        if (!inputField.length) {
          var inputField = $("<input>")
            .attr({
              class: "testInput",
              type: "text",
              id: "dynamic-edit-project-name",
              size: "47px",
              maxlength: "255",
              title: "project name",
              placeholder: "Enter name...",
            })
            .val(projectNameText);
          parentDiv.append(inputField);

          // Handle project name update
          inputField.on("keypress", function (e) {
            if (e.which == 13) {
              $(this).blur();
              e.preventDefault();
              var updatedName = $(this).val();
              $.ajax({
                type: "PUT",
                url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                contentType: "application/json",
                data: JSON.stringify({ project: { name: updatedName } }),
                success: function (result, status, xhr) {
                  projectNameSpan.text(updatedName).show();
                  parentDiv
                    .find("a.project")
                    .attr("href", `/projects/${updatedName}`);
                  inputField.remove();
                },
                error: function (xhr, status, error) {
                  console.error("Error:", error);
                  console.log(xhr.responseText);
                },
              });
            }
          });
        } else {
          inputField.css("display", "block");
        }
        var customFieldContainer = $(this).closest(
          ".string, .date, .float, .bool, .int, .link, .list, .user, .version, .text"
        );
        $(document).on('click', function(event) {
          
        });
        $(document).on("mouseup", function (e) {
          var container = $(".testInput");
          if (!container.is(e.target) && container.has(e.target).length === 0) {
            $(".testInput").css("display", "none");
            $(".div_text").css("display", "inline-block");
            customFieldContainer
              .find(".div_text")
              .css("display", "inline-block");
          } else {
            var clickedInput = $(e.target).closest(".testInput");
            if (!clickedInput.length) {
              $(".testInput").not(clickedInput).css("display", "none");
              $(".div_text").css("display", "inline-block");
              customFieldContainer
                .find(".div_text")
                .css("display", "inline-block");
            }
          }
        });
        $(".custom-details").on("mouseup", function (e) {
          e.stopPropagation();
        });
        if (customFieldContainer.length) {
          var fieldType = "";
          if (customFieldContainer.hasClass("string")) {
            old_value=customFieldContainer.find('.div_text').text();
            fieldType = "text";
            var cdInput =
              "dynamic-edit-field-" +
              fieldType +
              "-" +
              customFieldContainer.attr("class");
            var placeholderText = "Enter custom field value...";
            var cdInput = $("<input>")
              .attr({
                class: "testInput",
                type: fieldType,
                id: cdInput,
                size: "17px",
                maxlength: "255",
                title: customFieldContainer.attr("title").replace(/-/g, " "),
                placeholder: placeholderText,
              })
              .val(customFieldContainer.find(".div_text").text().trim());

            customFieldContainer.find(".div_text").css("display", "none");
            customFieldContainer.addClass("no-tooltip");

            customFieldContainer.append(cdInput);

            cdInput.on("keypress", function (e) {
              if (e.which == 13) {
                var updatedValue = $(this).val();
                var customFieldId = $(this).closest(".string").attr("id");
                $(this)
                  .closest(".string")
                  .html(`<span class="div_text">${updatedValue}</span>`)
                  .each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                  });
                customFieldContainer.removeClass("no-tooltip");
                var requestData = {
                  project: {
                    custom_fields: [
                      {
                        id: customFieldId,
                        value: updatedValue,
                      },
                    ],
                  },
                };

                $.ajax({
                  type: "PUT",
                  url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                  contentType: "application/json",
                  data: JSON.stringify(requestData),
                  success: function (result, status, xhr) {
                    cdInput.remove();
                  },
                  error: function (xhr, status, error) {
                    customFieldContainer.html(`<span class="div_text">${old_value}</span>`).each(function() {
                    var editIssueSpan = createEditIssueSpan();
                    this.appendChild(editIssueSpan);
                    });
                    addErrorDiv(xhr.responseText)   
                    console.error("Error:", error);
                    console.log(xhr.responseText);
                  },
                });
              }
            });
          } else if (customFieldContainer.hasClass("text")) {
            old_value=customFieldContainer.find('.div_text').text();
            fieldType = "texts";
            var cdInput =
              "dynamic-edit-field-" +
              fieldType +
              "-" +
              customFieldContainer.attr("class");
            var placeholderText = "Enter custom field value...";
            var cdInput = $("<input>")
              .attr({
                class: "testInput",
                type: fieldType,
                id: cdInput,
                size: "17px",
                maxlength: "255",
                title: customFieldContainer.attr("title").replace(/-/g, " "),
                placeholder: placeholderText,
              })
              .val(customFieldContainer.find(".div_text").text().trim());

            customFieldContainer.find(".div_text").css("display", "none");
            customFieldContainer.addClass("no-tooltip");

            customFieldContainer.append(cdInput);

            cdInput.on("keypress", function (e) {
              if (e.which == 13) {
                var updatedValue = $(this).val();
                var customFieldId = $(this).closest(".text").attr("id");

                $(this)
                  .closest(".text")
                  .html(`<span class="div_text">${updatedValue}</span>`)
                  .each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                  });
                customFieldContainer.removeClass("no-tooltip");
                var requestData = {
                  project: {
                    custom_fields: [
                      {
                        id: customFieldId,
                        value: updatedValue,
                      },
                    ],
                  },
                };

                $.ajax({
                  type: "PUT",
                  url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                  contentType: "application/json",
                  data: JSON.stringify(requestData),
                  success: function (result, status, xhr) {
                    cdInput.remove();
                  },
                  error: function (xhr, status, error) {
                    customFieldContainer.html(`<span class="div_text">${old_value}</span>`).each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                      });
                      addErrorDiv(xhr.responseText)  
                    console.error("Error:", error);
                    console.log(xhr.responseText);
                  },
                });
              }
            });
          } else if (customFieldContainer.hasClass("date")) {
            old_value=customFieldContainer.find('.div_text').text();
            fieldType = "date";
            var cdInput =
              "dynamic-edit-field-" +
              fieldType +
              "-" +
              customFieldContainer.attr("class");

            var inputField = $("<input>")
              .attr({
                class: "testInput",
                type: fieldType,
                id: cdInput,
                size: "17px",
                maxlength: "30",
                title: customFieldContainer.attr("title").replace(/-/g, " "),
              })
              .val(customFieldContainer.find(".div_text").text().trim());

            customFieldContainer.find(".div_text").hide();
            customFieldContainer.addClass("no-tooltip");
            customFieldContainer.append(inputField);

            // Handle custom field update
            inputField.on("change", function (e) {
              var updatedValue = $(this).val();
              var customFieldId = $(this).closest(".date").attr("id");

              $(this)
                  .closest(".date")
                  .html(`<span class="div_text">${updatedValue}</span>`)
                  .each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                  });

              var requestData = {
                project: {
                  custom_fields: [
                    {
                      id: customFieldId,
                      value: updatedValue,
                    },
                  ],
                },
              };

              $.ajax({
                type: "PUT",
                url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                contentType: "application/json",
                data: JSON.stringify(requestData),
                success: function (result, status, xhr) {
                  inputField.remove();
                  customFieldContainer.removeClass("no-tooltip");
                },
                error: function (xhr, status, error) {
                  customFieldContainer.html(`<span class="div_text">${old_value}</span>`).each(function() {
                    var editIssueSpan = createEditIssueSpan();
                    this.appendChild(editIssueSpan);
                    });
                    addErrorDiv(xhr.responseText)  
                  console.error("Error:", error);
                  console.log(xhr.responseText);
                },
              });
            });
          } else if (customFieldContainer.hasClass("float")) {
            old_value=customFieldContainer.find('.div_text').text();
            fieldType = "number";
            var cdInput =
              "dynamic-edit-field-" +
              fieldType +
              "-" +
              customFieldContainer.attr("class");

            var inputField = $("<input>")
              .attr({
                class: "testInput",
                type: fieldType,
                id: cdInput,
                size: "10px",
                maxlength: "100",
                title: customFieldContainer.attr("title").replace(/-/g, " "),
                step: "0.01"
              })
              .val(customFieldContainer.text().trim());

            customFieldContainer.find(".div_text").hide();
            customFieldContainer.addClass("no-tooltip");
            customFieldContainer.append(inputField);

            inputField.on("keypress", function (e) {
              if (e.which == 13) {
                e.preventDefault();
                var updatedValue = $(this).val();
                var customFieldId = $(this).closest(".float").attr("id");
                var divTextElement = $(this)
                  .closest(".float")
                  .find(".div_text");

                  $(this)
                  .closest(".float")
                  .html(`<span class="div_text">${updatedValue}</span>`)
                  .each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                  });
                divTextElement.text(updatedValue);
                customFieldContainer.removeClass("no-tooltip");
                var requestData = {
                  project: {
                    custom_fields: [
                      {
                        id: customFieldId,
                        value: updatedValue,
                      },
                    ],
                  },
                };

                $.ajax({
                  type: "PUT",
                  url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                  contentType: "application/json",
                  data: JSON.stringify(requestData),
                  success: function (result, status, xhr) {
                    inputField.remove();
                  },
                  error: function (xhr, status, error) {
                    customFieldContainer.html(`<span class="div_text">${old_value}</span>`).each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                      });
                      addErrorDiv(xhr.responseText)  
                    console.error("Error:", error);
                    console.log(xhr.responseText);
                  },
                });
              }
            });
          } else if (customFieldContainer.hasClass("int")) {
            old_value=customFieldContainer.find('.div_text').text();
            fieldType = "number";
            var cdInput =
              "dynamic-edit-field-" +
              fieldType +
              "-" +
              customFieldContainer.attr("class");
            // var placeholderText = 'Enter custom field value...';
            var inputField = $("<input>")
              .attr({
                class: "testInput",
                type: fieldType,
                id: cdInput,
                size: "15px",
                maxlength: "100",
                title: customFieldContainer.attr("title").replace(/-/g, " "),
                // placeholder: placeholderText
              })
              .val(customFieldContainer.text().trim());
            customFieldContainer.find(".div_text").hide();
            customFieldContainer.addClass("no-tooltip");
            customFieldContainer.append(inputField);
            inputField.on("keypress", function (e) {
              if (e.which == 13) {
                var updatedValue = $(this).val();
                var customFieldId = $(this).closest(".int").attr("id");
                $(this)
                  .closest(".int")
                  .html(`<span class="div_text">${updatedValue}</span>`)
                  .each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                  });
                customFieldContainer.removeClass("no-tooltip");
                var requestData = {
                  project: {
                    custom_fields: [
                      {
                        id: customFieldId,
                        value: updatedValue,
                      },
                    ],
                  },
                };
                $.ajax({
                  type: "PUT",
                  url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                  contentType: "application/json",
                  data: JSON.stringify(requestData),
                  success: function (result, status, xhr) {
                    inputField.remove();
                  },
                  error: function (xhr, status, error) {
                    customFieldContainer.html(`<span class="div_text">${old_value}</span>`).each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                      });
                      addErrorDiv(xhr.responseText)  
                    console.error("Error:", error);
                    console.log(xhr.responseText);
                  },
                });
              }
            });
          } else if (customFieldContainer.hasClass("link")) {
            old_value=customFieldContainer.find('.div_text').text();
            fieldType = "text";
            var cdInput =
              "dynamic-edit-field-" +
              fieldType +
              "-" +
              customFieldContainer.attr("class");
            // var placeholderText = 'Enter http address...';
            var inputField = $("<input>")
              .attr({
                class: "testInput",
                type: fieldType,
                id: cdInput,
                size: "15px",
                maxlength: "255",
                title: customFieldContainer.attr("title").replace(/-/g, " "),
                // placeholder: placeholderText
              })
              .val(customFieldContainer.text().trim());
            customFieldContainer.find(".div_text").hide();
            customFieldContainer.addClass("no-tooltip");
            customFieldContainer.append(inputField);
            inputField.on("keypress", function (e) {
              if (e.which == 13) {
                var updatedValue = $(this).val();
                var customFieldId = $(this).closest(".link").attr("id");
                $(this)
                  .closest(".link")
                  .html(`<span class="div_text">${updatedValue}</span>`)
                  .each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                  });
                customFieldContainer.removeClass("no-tooltip");
                var requestData = {
                  project: {
                    custom_fields: [
                      {
                        id: customFieldId,
                        value: updatedValue,
                      },
                    ],
                  },
                };
                $.ajax({
                  type: "PUT",
                  url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                  contentType: "application/json",
                  data: JSON.stringify(requestData),
                  success: function (result, status, xhr) {
                    // location.reload();
                    inputField.remove();
                  },
                  error: function (xhr, status, error) {
                    customFieldContainer.html(`<span class="div_text">${old_value}</span>`).each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                      });
                      addErrorDiv(xhr.responseText)  
                    console.error("Error:", error);
                    console.log(xhr.responseText);
                  },
                });
              }
            });
          } else if (customFieldContainer.hasClass("bool")) {
            var boolDiv = $(this).closest(".bool");
            var id=boolDiv.attr('id')
            cf_getCustomData(projectDisplayId, boolDiv,id);
          } else if (customFieldContainer.hasClass("list")) {
            var listDiv = $(this).closest(".list");
            var id=listDiv.attr('id')
            cf_listData(projectDisplayId, listDiv,id);
          } else if (customFieldContainer.hasClass("user")) {
            var userDiv = $(this).closest(".user");
            cf_appendAssigneeDropdown(projectDisplayId, userDiv);
          } else if (customFieldContainer.hasClass("version")) {
            var versionDiv = $(this).closest(".version");
            cf_versionDropdown(projectDisplayId, versionDiv);
          }
        }
      });
    }
    function cf_listData(projectDisplayId, listDiv,id) {
      old_value=listDiv.find('.div_text').text();
      var cf_valid = false;
      $.ajax({
        url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        data: { limit: 200 },
        success: function (data) {
          var project_data = data.project;
          var c_f_issue = project_data.custom_fields;

          var customFieldsData = [];

          $.ajax({
            url: `${url}/all_custom_fields.json?key=${project_api_key}`,
            type: "GET",
            dataType: "json",
            success: function (result, index, xhr) {
              // console.log(result,'new result');
              result.forEach((field) => {
                customFieldsData.push({ id: field.id, format_store: field.format_store });
            });
            },
            });
          
            // console.log(customFieldsData,'customFieldsData');

          $.ajax({
            url: `${url}/custom_fields.json?key=${project_api_key}`,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (result, index, xhr) {
              // console.log(result,'ssjjs')
              var custom_cf_Dropdown_list;            
              var listElement = listDiv;
              // Remove any existing dropdown
              listElement.find("#custom_cf_Dropdown_list").remove();
              result.custom_fields.forEach((data, index) => {
                if (data.customized_type === "project") {
                  if (data.field_format == "list" && data.id==id) {
                    // ===========
                    var matchedField = customFieldsData.find(field => field.id === data.id);
                    var checkbox_type = false;
                    if (matchedField) {
                      var format_store = matchedField.format_store;
                      // console.log(format_store, 'format_store'); 
                    
                   
                    if (format_store.edit_tag_style === "check_box") {
                         checkbox_type = true;
                    }else{
                         checkbox_type = false;                   
                    }
                  }
                    
                    var multiselect =  data.multiple
                    // console.log(multiselect, 'multiselect');
                    // console.log(checkbox_type, 'checkbox_type');
                    setTimeout(function () {
                    // if (checkbox_type){
                    // =========== multi select false , checkbox false==========

                    if (multiselect == false && checkbox_type == false) {
                    var cf_list = data.possible_values;
                    listElement.addClass("no-tooltip");
                    listElement.find(".div_text").css("display", "none");
                    custom_cf_Dropdown_list = $("<select>")
                      .attr("id", "custom_cf_Dropdown_list")
                      .addClass("testInput");
                    custom_cf_Dropdown_list.append(
                      $("<option>").val("").text("")
                    );
                    // Get the current value from the div_text
                    var currentValue = listElement.find(".div_text").text();
                    // Iterate over cf_list and create an option for each value
                    cf_list.forEach(function (item) {
                      var selected = item.label === currentValue;
                      custom_cf_Dropdown_list.append(
                        $("<option>", {
                          value: item.value,
                          text: item.label,
                          selected: selected,
                        })
                      );
                    });
                    listElement.append(custom_cf_Dropdown_list);
                    custom_cf_Dropdown_list.on("change", function () {
                      listElement.removeClass("no-tooltip");
                      var updatedValue = $(this).val();
                      var selectedText = $(this).find("option:selected").text();
                      var customFieldId = $(this).closest(".list").attr("id");
                      $(this)
                          .closest(".list")
                          .html(`<span class="div_text">${selectedText}</span>`)
                          .each(function() {
                              var editIssueSpan = createEditIssueSpan();
                              this.appendChild(editIssueSpan);
                          });
                      var requestData = {
                        project: {
                          custom_fields: [
                            {
                              id: customFieldId,
                              value: updatedValue,
                            },
                          ],
                        },
                      };
                      $.ajax({
                        type: "PUT",
                        url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                        contentType: "application/json",
                        data: JSON.stringify(requestData),
                        success: function (result, status, xhr) {
                          // location.reload();
                          custom_cf_Dropdown_list.remove();
                        },
                        error: function (xhr, status, error) {
                          listDiv.html(`<span class="div_text">${old_value}</span>`).each(function() {
                            var editIssueSpan = createEditIssueSpan();
                            this.appendChild(editIssueSpan);
                            });
                            addErrorDiv(xhr.responseText)
                          console.error("Error:", error);
                          console.log(xhr.responseText);
                        },
                      });
                    });
                  }
                  else if (multiselect == true && checkbox_type == false) {
                    // Dropdown with multiple selection
                    var cf_list = data.possible_values;
                    listElement.addClass("no-tooltip");
                    listElement.find(".div_text").css("display", "none");
                    custom_cf_Dropdown_list = $("<select>")
                        .attr("id", "custom_cf_Dropdown_list")
                        .addClass("testInput")
                        .attr("multiple", "multiple"); 
                    // Get the current values from the div_text
                    var currentValue = listElement.find(".div_text").text();
                    var selectedValues = currentValue.split(", "); 
                    // Iterate over cf_list and create an option for each value
                    cf_list.forEach(function (item) {
                        var selected = selectedValues.includes(item.label); 
                        custom_cf_Dropdown_list.append(
                            $("<option>", {
                                value: item.value,
                                text: item.label,
                                selected: selected,
                            })
                        );
                    });
                    listElement.append(custom_cf_Dropdown_list);

            $(document.body).on("click", function (event) {
           if (!$(event.target).closest(custom_cf_Dropdown_list).length && !$(event.target).closest(listElement).length) {
            // Click occurred outside the dropdown and the list element
            var updatedValues = custom_cf_Dropdown_list.val();
            var selectedText = custom_cf_Dropdown_list.find("option:selected").map(function () {
                return $(this).text();
            }).get().join(", ");
            var customFieldId = listElement.attr("id");
            $(listElement)
                .html(`<span class="div_text">${selectedText}</span>`)
                .each(function () {
                    var editIssueSpan = createEditIssueSpan();
                    this.appendChild(editIssueSpan);
                });
            var requestData = {
                project: {
                    custom_fields: [
                        {
                            id: customFieldId,
                            value: updatedValues,
                        },
                    ],
                },
            };
            $.ajax({
                type: "PUT",
                url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                contentType: "application/json",
                data: JSON.stringify(requestData),
                success: function (result, status, xhr) {
                    custom_cf_Dropdown_list.remove();
                },
                error: function (xhr, status, error) {
                    listDiv.html(`<span class="div_text">${old_value}</span>`).each(function () {
                        var editIssueSpan = createEditIssueSpan();
                        this.appendChild(editIssueSpan);
                    });
                    addErrorDiv(xhr.responseText)
                    console.error("Error:", error);
                    console.log(xhr.responseText);
                },
            });
        }
    });
}

else if (multiselect == false && checkbox_type == true) {
  var cf_list = data.possible_values;
  listElement.addClass("no-tooltip");
  listElement.find(".div_text").css("display", "none");

  // Create a div to contain radio buttons
  var radioDiv = $("<div>").addClass("radio-buttons");

  // Get the current value from the div_text
  var currentValue = listElement.find(".div_text").text();

  // Iterate over possible values and create radio buttons
  data.possible_values.forEach(function (item) {
      var isChecked = item.label === currentValue;
      var radioButton = $("<input>")
          .attr("type", "radio")
          .addClass("radioInput")
          .attr("name", "custom_field_radio")
          .val(item.value)
          .prop("checked", isChecked);
      var radioLabel = $("<label>").text(item.label);
      radioDiv.append(radioButton, radioLabel, "<br>");
  });

  listElement.append(radioDiv);

  function saveData() {
      listElement.removeClass("no-tooltip");
      var updatedValue = radioDiv.find("input.radioInput:checked").val();
      var updatedText = radioDiv.find("input.radioInput:checked").next("label").text();
      var customFieldId = listElement.attr("id");
      var requestData = {
          project: {
              custom_fields: [
                  {
                      id: customFieldId,
                      value: updatedValue,
                  },
              ],
          },
      };
      $.ajax({
          type: "PUT",
          url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
          contentType: "application/json",
          data: JSON.stringify(requestData),
          success: function (result, status, xhr) {
              radioDiv.remove();
              listElement.html(`<span class="div_text">${updatedText}</span>`).each(function () {
                  var editIssueSpan = createEditIssueSpan();
                  this.appendChild(editIssueSpan);
              });
          },
          error: function (xhr, status, error) {
              listDiv.html(`<span class="div_text">${old_value}</span>`).each(function () {
                  var editIssueSpan = createEditIssueSpan();
                  this.appendChild(editIssueSpan);
              });
              addErrorDiv(xhr.responseText)
              console.error("Error:", error);
              console.log(xhr.responseText);
          },
      });
  }

  // Event listener for radio button change
  radioDiv.on("change", ".radioInput", function () {
      saveData();
  });

  // Event listener for clicks outside the radioDiv
  $(document).on("click", function (event) {
      if (!$(event.target).closest(radioDiv).length && !$(event.target).closest(listElement).length) {
          saveData();
      }
  });
}


else if (multiselect == true && checkbox_type == true) {
  listElement.addClass("no-tooltip");
  var cf_list = data.possible_values;
  var checkboxDiv = $("<div>").addClass("checkbox-div");

  // Get the current values from the div_text
  var currentValue = listElement.find(".div_text").text();
  var selectedValues = currentValue.split(", ");

  // Create and append checkboxes for each possible value
  cf_list.forEach(function (item) {
      var isChecked = selectedValues.includes(item.label);
      var checkbox = $("<input>")
          .attr("type", "checkbox")
          .addClass("checkboxInput")
          .attr("value", item.value)
          .prop("checked", isChecked);
      var label = $("<label>").text(item.label);
      checkboxDiv.append(checkbox).append(label).append($("<br>"));
  });

  listElement.append(checkboxDiv);

  $(document.body).on("click", function (event) {
      if (!$(event.target).closest(listElement).length) {
          var updatedValues = checkboxDiv.find(".checkboxInput:checked").map(function () {
              return $(this).val();
          }).get();

          var updatedLabels = checkboxDiv.find(".checkboxInput:checked").map(function () {
              return $(this).next("label").text();
          }).get();

          // Prepare the request data
          var customFieldId = listElement.attr("id");
          var requestData = {
              project: {
                  custom_fields: [
                      {
                          id: customFieldId,
                          value: updatedValues,
                      },
                  ],
              },
          };

          // Make the PUT request to save the data
          $.ajax({
              type: "PUT",
              url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
              contentType: "application/json",
              data: JSON.stringify(requestData),
              success: function (result, status, xhr) {
                  // Show the selected values
                  listElement.find(".div_text").text(updatedLabels.join(", "));
                  // Hide the checkbox div
                  checkboxDiv.remove();
              },
              error: function (xhr, status, error) {
                  // Handle error
                  console.error("Error:", error);
                  console.log(xhr.responseText);
              },
          });
      }
  });
}

// }
        }, 1000);
                  // =====================

                  }
                }
              });
            },
            error: function () {},
          });
        },
        error: function () {},
      });
    }
    function cf_getCustomData(projectDisplayId, boolDiv,id) {
      old_value=boolDiv.find('.div_text').text();
      var cf_valid = false;
      $.ajax({
        url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        data: { limit: 200 },
        success: function (data) {
          var project_data = data.project;
          var c_f_issue = project_data.custom_fields;
          $.ajax({
            url: `${url}/custom_fields.json?key=${project_api_key}`,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (result, index, xhr) {
              var custom_cf_Dropdown_bool;
              var boolElement = boolDiv;
              // Remove any existing dropdown
              boolElement.find("#custom_cf_Dropdown_bool").remove();
              result.custom_fields.forEach((data, index) => {
                if (data.customized_type === "project") {
                  if (data.field_format == "bool" && data.id==id) {
                    var cf_bool = data.possible_values;
                    boolElement.addClass("no-tooltip");
                    boolElement.find(".div_text").css("display", "none");
                    custom_cf_Dropdown_bool = $("<select>")
                      .attr("id", "custom_cf_Dropdown_bool")
                      .addClass("testInput");
                    custom_cf_Dropdown_bool.append(
                      $("<option>").val("").text("")
                    );

                    // Get the current value from the div_text
                    var currentValue = boolElement.find(".div_text").text();

                    // Iterate over cf_bool and create an option for each value
                    cf_bool.forEach(function (item) {
                      var selected = item.label === currentValue;
                      custom_cf_Dropdown_bool.append(
                        $("<option>", {
                          value: item.value,
                          text: item.label,
                          selected: selected,
                        })
                      );
                    });

                    boolElement.append(custom_cf_Dropdown_bool);

                    custom_cf_Dropdown_bool.on("change", function () {
                      boolElement.removeClass("no-tooltip");
                      var updatedValue = $(this).val();
                      var selectedText = $(this).find("option:selected").text();
                      var customFieldId = $(this).closest(".bool").attr("id");
                      $(this)
                      .closest(".bool")
                      .html(`<span class="div_text">${selectedText}</span>`)
                      .each(function() {
                          var editIssueSpan = createEditIssueSpan();
                          this.appendChild(editIssueSpan);
                      });
                      var requestData = {
                        project: {
                          custom_fields: [
                            {
                              id: customFieldId,
                              value: updatedValue,
                            },
                          ],
                        },
                      };

                      $.ajax({
                        type: "PUT",
                        url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                        contentType: "application/json",
                        data: JSON.stringify(requestData),
                        success: function (result, status, xhr) {
                          // location.reload();
                          custom_cf_Dropdown_bool.remove();
                        },
                        error: function (xhr, status, error) {
                          boolDiv.html(`<span class="div_text">${old_value}</span>`).each(function() {
                            var editIssueSpan = createEditIssueSpan();
                            this.appendChild(editIssueSpan);
                            });
                            addErrorDiv(xhr.responseText)
                          console.error("Error:", error);
                          console.log(xhr.responseText);
                        },
                      });
                    });
                  }
                }
              });
            },
            error: function () {},
          });
        },
        error: function () {},
      });
    }
    //version dropdown
    function cf_versionDropdown(projectDisplayId, versionDiv) {
      old_value=versionDiv.find('.div_text').text();
      var cf_valid = false;
      $.ajax({
        type: "GET",
        url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
          var project_data = data.project;
          var cf_version_id = project_data.id;
          $.ajax({
            url: `${url}/projects/${cf_version_id}/versions.json?key=${project_api_key}`,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (data) {
              var versions = data.versions;
              var versionElement = versionDiv;
              // Remove any existing dropdown
              versionElement.find("#custom_versionDropdown").remove();
              versionElement.find(".div_text").css("display", "none");
              var custom_versionDropdown = $("<select>")
                .attr("id", "custom_versionDropdown")
                .addClass("testInput");
              custom_versionDropdown.append($("<option>").val("").text(""));

              // Get the current value from the div_text
              var currentValue = versionElement.find(".div_text").text();

              versions.forEach(function (version) {
                var selected = version.name === currentValue;
                custom_versionDropdown.append(
                  $("<option>", {
                    value: version.id,
                    text: version.name,
                    selected: selected,
                  })
                );
              });
              versionElement.addClass('no-tooltip');
              versionElement.append(custom_versionDropdown);

              custom_versionDropdown.on("change", function () {
                var updatedValue = $(this).val();
                var selectedText = $(this).find("option:selected").text();
                var customFieldId = $(this).closest(".version").attr("id");
                $(this)
                          .closest(".version")
                          .html(`<span class="div_text">${selectedText}</span>`)
                          .each(function() {
                              var editIssueSpan = createEditIssueSpan();
                              this.appendChild(editIssueSpan);
                          });
                var requestData = {
                  project: {
                    custom_fields: [
                      {
                        id: customFieldId,
                        value: updatedValue,
                      },
                    ],
                  },
                };
                $.ajax({
                  type: "PUT",
                  url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                  contentType: "application/json",
                  data: JSON.stringify(requestData),
                  success: function (result, status, xhr) {
                    // location.reload();
                    custom_versionDropdown.remove();
                    versionElement.removeClass('no-tooltip');
                  },
                  error: function (xhr, status, error) {
                    versionDiv.html(`<span class="div_text">${old_value}</span>`).each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                      });
                      addErrorDiv(xhr.responseText)
                    console.error("Error:", error);
                    console.log(xhr.responseText);
                  },
                });
              });
            },
            error: function (error) {
              console.error("Error fetching custom fields:", error);
            },
          });
        },
        error: function (error) {
          console.error("Error fetching project data:", error);
        },
      });
    }
    function cf_appendAssigneeDropdown(projectDisplayId, userDiv) {
      old_value=userDiv.find('.div_text').text();
      $.ajax({
        url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        data: { limit: 200 },
        success: function (data) {
          var project_data = data.project;
          projectDisplayId = project_data.id;
          $.ajax({
            url: `${url}/projects/${parseInt(
              projectDisplayId
            )}/active_memberss.json?key=${project_api_key}`,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (data) {
              var members = data.active_members;
              var userElement = userDiv;

              // Remove any existing dropdown
              userElement.find("#cf_userDropdown").remove();
              userElement.addClass("no-tooltip");
              userElement.find(".div_text").css("display", "none");
              var cf_userDropdown = $("<select>")
                .attr("id", "cf_userDropdown")
                .addClass("testInput");
              cf_userDropdown.append($("<option>").val("").text(""));

              // Get the current value from the div_text
              var currentValue = userElement.find(".div_text").text();

              members.forEach(function (user) {
                var selected = user.name === currentValue;
                cf_userDropdown.append(
                  $("<option>", {
                    value: user.id,
                    text: user.name,
                    selected: selected,
                  })
                );
              });

              userElement.append(cf_userDropdown);

              // Listen to change event on the dropdown
              cf_userDropdown.on("change", function () {
                userElement.removeClass("no-tooltip");
                var updatedValue = $(this).val();
                var selectedText = $(this).find("option:selected").text();
                var customFieldId = $(this).closest(".user").attr("id");
                $(this).closest(".user")
                          .html(`<span class="div_text">${selectedText}</span>`)
                          .each(function() {
                              var editIssueSpan = createEditIssueSpan();
                              this.appendChild(editIssueSpan);
                          });
                var requestData = {
                  project: {
                    custom_fields: [
                      {
                        id: customFieldId,
                        value: updatedValue,
                      },
                    ],
                  },
                };

                $.ajax({
                  type: "PUT",
                  url: `${url}/projects/${projectDisplayId}.json?key=${project_api_key}`,
                  contentType: "application/json",
                  data: JSON.stringify(requestData),
                  success: function (result, status, xhr) {
                    // location.reload();
                    cf_userDropdown.remove();
                  },
                  error: function (xhr, status, error) {
                    userDiv.html(`<span class="div_text">${old_value}</span>`).each(function() {
                      var editIssueSpan = createEditIssueSpan();
                      this.appendChild(editIssueSpan);
                      });
                      addErrorDiv(xhr.responseText)
                    console.error("Error:", error);
                    console.log(xhr.responseText);
                  },
                });
              });
            },
            error: function () {},
          });
        },
        error: function () {},
      });
    }
  }
});

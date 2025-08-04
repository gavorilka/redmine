$("document").ready(function () {
    function isSafari() {
      return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    if (isSafari()) {
      document.body.classList.add('safari');
    }
    if ($("body").hasClass("controller-projects")) {
    var url = window.location.origin;
    var project_api_key = localStorage.getItem("issue_table_api_key");
    var selected_date_format = localStorage.getItem("dateFormat");
    var custom_id;
    var tdId = "";
    $(document).ready(function () {
      var pageConditionElementList = document.querySelector(
        ".controller-projects.action-index .autoscroll"
      );
      if (pageConditionElementList) {
        var svg_pencil = `<svg width="12" height="14" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M19.6045 5.2808L17.8579 7.02704L13.8584 3.02715L15.6613 1.22427C16.112 0.773551 16.9568 0.773551 17.4642 1.22427L19.7173 3.47742C20.1114 3.98472 20.1114 4.77339 19.6045 5.28069L19.6045 5.2808Z" fill="#1D273C"/>
       <path d="M1.46498 15.4773C3.15509 16.3221 4.56343 17.7304 5.40823 19.3644L0 20.8855L1.46498 15.4773ZM6.25313 18.6319C5.35171 16.9418 3.94336 15.4773 2.25325 14.632L13.0693 3.81592L17.0692 7.81581L6.25313 18.6319Z" fill="#1D273C"/>
       </svg>`;

        var parentContainer = document.querySelector(
          ".controller-projects.action-index"
        );

        if (parentContainer) {
          var trackerCells = parentContainer.querySelectorAll(
            " td.parent_id,td.homepage, td.int , td.string , td.date , td.list , td.user , td.float , td.bool , td.text , td.version"
          );
          trackerCells.forEach(function (cell) {
            var trackerText = cell.textContent.trim();
            var spanElement = document.createElement("span");
            spanElement.classList.add("td_text");
            spanElement.textContent = trackerText;
            cell.innerHTML = "";
            cell.appendChild(spanElement);
          });
        }

        $(
          ".controller-projects.action-index .list.projects tr:not(.group.open) td"
        ).each(function () {
          if (permissionstatus == "true") {
            const excludedClasses = [
              "is_public",
              "identifier",
              "created_on",
              "updated_on",
              "total_spent_time",
              "divergent_hours",
              "total_remaining_hours",
              "approved_hours",
              "total_estimated_time",
              "status",
              "short_description",
              "attachment",
              "enumeration",
              "tags",
            ];
            if (
              !excludedClasses.some((className) => $(this).hasClass(className))
            ) {
              $(this).append(
                '<span class="edit-issue" style="display: none;">' +
                  svg_pencil +
                  "</span>"
              );
            }
          }
        });

        $(
          ".controller-projects.action-index .list.projects tr:not(.group.open) td"
        ).hover(
          function () {
            $(this).children(".edit-issue").css("display", "inline-block");
          },
          function () {
            $(this).children(".edit-issue").hide();
          }
        );

        // date-format
        function changeFormat(date, date_formate) {
          if (date_formate === "DD/MM/YYYY") {
            const dateParts = date.split("/");
            const dd = String(parseInt(dateParts[0], 10)).padStart(2, "0");
            const mm = String(parseInt(dateParts[1], 10)).padStart(2, "0");
            const yyyy = String(parseInt(dateParts[2], 10));

            return `${yyyy}-${mm}-${dd}`;
          } else if (date_formate === "DD.MM.YYYY") {
            const dateParts = date.split(".");
            const dd = String(parseInt(dateParts[0], 10)).padStart(2, "0");
            const mm = String(parseInt(dateParts[1], 10)).padStart(2, "0");
            const yyyy = String(parseInt(dateParts[2], 10));

            return `${yyyy}-${mm}-${dd}`;
          } else if (date_formate === "DD-MM-YYYY") {
            const dateParts = date.split("-");
            const dd = String(parseInt(dateParts[0], 10)).padStart(2, "0");
            const mm = String(parseInt(dateParts[1], 10)).padStart(2, "0");
            const yyyy = String(parseInt(dateParts[2], 10));

            return `${yyyy}-${mm}-${dd}`;
          } else {
            var today = new Date(date);
            const dd = String(today.getDate()).padStart(2, "0");
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const yyyy = today.getFullYear();
            return `${yyyy}-${mm}-${dd}`;
          }
        }

        var projectId;
        var currentTdClass;

        $(".edit-issue").on("click", function (e) {
          e.preventDefault();
          var currentRow = $(this).closest("tr");
          var currentColumn = $(this).closest("td");
          var Id = currentRow.attr("id");
          var project_ProjectId = Id.split("-")[1];
          projectId = parseInt(project_ProjectId);

          var clickedtd = $(this).closest("td").attr("class");
          var clickedtd_split = clickedtd.split(" ")[0];
          var cf_Id = clickedtd.substring(3, 5);

          if (tdId != "") {
            $(`#${tdId}`).remove();
            var data = tdId.split("-");
            $(`td#issue_${data[1]}_id-${data[3]}`).css("display", "revert");
          }

          // When click occurred outside table the input(editor) hide
          $(document).on("click", function (e) {
            var $target = $(e.target);
            if (!$target.closest("table").length) {
              if (tdId != "") {
                $(`#${tdId}`).remove();
                var data = tdId.split("-");
                $(`td#issue_${data[1]}_id-${data[3]}`).css("display", "revert");
                tdId = "";
              }
            }
          });

          custom_id = parseInt(cf_Id);
          var rowId = currentRow.attr("id");
          tdId = `dynamic-${clickedtd_split}-edit-${projectId}`;
          var trId = $(this).closest("tr").attr("id");
          var trId = rowId;
          var regex = /-(\d+)/;
          var match = trId.match(regex);
          var project_id = match ? match[1] : null;

          $(currentRow)
            .find(currentColumn)
            .attr("id", `issue_${clickedtd_split}_id-${projectId}`);
          currentTdClass = $(this).closest("td").attr("id");
          project_name = currentRow.find("td.name").text();
          project_Id = currentRow.find("td.id").text();
          $(".edit-issue").css("display", "none");
          $(`<td id=${tdId}></td>`).insertAfter("#" + currentTdClass);
          currentRow.find("td#" + currentTdClass).css("display", "none");
          $(this).css("display", "none");

          // ------------- name ----------------

          if (clickedtd == "name") {
            var get_project_text = currentRow.find("td.name a").text();
            $(`tr#${rowId} td#${tdId}`).append(
              `<input class="update_project_name" id="dynamic-edit-${currentTdClass}" size="40px" maxlength="255"  title="project name" type="text" ></input>`
            );
            let set_project_text = document.getElementById(
              `dynamic-edit-${currentTdClass}`
            );
            set_project_text.value = `${get_project_text}`;

            $(`#${tdId}`).on("keypress", function (e) {
              if (e.which == 13) {
                var updatedName = $(`#dynamic-edit-${currentTdClass}`).val();
                var trId = $(this).closest("tr").attr("id");
                var regex = /-(\d+)/;
                var match = trId.match(regex);
                var project_id = match ? match[1] : null;
                if (updatedName.trim() !== "") {
                  currentRow.find("td.name a").html(updatedName);
                }
                $(`#${tdId}`).remove();
                $(`td#issue_name_id-${project_id}`).css("display", "revert");

                var requestData = {
                  project: {
                    name: updatedName,
                  },
                };

                $.ajax({
                  type: "PUT",
                  url: `${url}/projects/${parseInt(
                    project_id
                  )}.json?key=${project_api_key}`,
                  contentType: "application/json",
                  data: JSON.stringify(requestData),
                  success: function (result, status, xhr) {},
                  error: function (xhr, status, error) {
                    console.log(
                      "Result: " +
                        status +
                        " " +
                        error +
                        " " +
                        xhr.status +
                        " " +
                        xhr.statusText
                    );
                  },
                });
              }
            });
          }
          // homepage
          else if (clickedtd == "homepage") {
            var get_homepage_text = currentRow
              .find("td.homepage span.td_text")
              .text();

            $(`tr#${rowId} td#${tdId}`).append(
              `<input class="update_project_homepage" id="dynamic-edit-${currentTdClass}" size="65px" maxlength="255"  title="Issue homepage" placeholder="Enter text..." type="text" ></input>`
            );
            // $(`#dynamic-edit-${currentTdClass}`).val(get_homepage_text);

            let set_HomePage_text = document.getElementById(
              `dynamic-edit-${currentTdClass}`
            );

            set_HomePage_text.value = `${get_homepage_text}`;

            $(`#${tdId}`).on("keypress", function (e) {
              if (e.which == 13) {
                var updatedHomepage = $(
                  `#dynamic-edit-${currentTdClass}`
                ).val();
                var trId = $(this).closest("tr").attr("id");
                var regex = /-(\d+)/;
                var match = trId.match(regex);
                var project_id = match ? match[1] : null;
                if (updatedHomepage.trim() !== "") {
                  currentRow
                    .find("td.homepage span.td_text")
                    .html(updatedHomepage);
                }
                $(`#${tdId}`).remove();
                $(`td#issue_homepage_id-${projectId}`).css("display", "revert");
                var content1 = {
                  project: {
                    homepage: updatedHomepage,
                  },
                };
                $.ajax({
                  type: "PUT",
                  url: `${url}/projects/${parseInt(
                    project_id
                  )}.json?key=${project_api_key}`,
                  contentType: "application/json",
                  data: JSON.stringify(content1),
                  success: function (result, status, xhr) {
                    console.log("Result:", result);
                  },
                  error: function (xhr, status, error) {
                    console.log(
                      "Result: " +
                        status +
                        " " +
                        error +
                        " " +
                        xhr.status +
                        " " +
                        xhr.statusText
                    );
                    let content = JSON.parse(xhr.responseText).errors;
                    if (Array.isArray(content)) {
                      content.forEach((error) => {
                        toastr["error"](error);
                      });
                    } else {
                      toastr["error"](content);
                    }
                  },
                });
              }
            });

            // Show the edit icon again
            $(this).closest("td").find(".edit-issue").show();
          }

          // ------------- Subproject Project ----------------

          if (clickedtd_split == "parent_id") {
            appendParentProjectDropdown(rowId, currentTdClass, project_id);
            var currentTdClass;

            $(`#${tdId}`).on("change", function () {
              var select_project;
              var issue_project_id;
              select_project = $("#project_project-" + project_id)
                .find("option:selected")
                .attr("title");
              issue_project_id = $("#project_project-" + project_id)
                .find("option:selected")
                .val();
              if (select_project === undefined) {
                currentRow.find("td.parent_id span.td_text").html("");
              } else {
                currentRow
                  .find("td.parent_id span.td_text")
                  .html(select_project);
              }
              $(`#${tdId}`).remove();
              $(`tr td#issue_parent_id_id-${project_id}`).css(
                "display",
                "revert"
              );

              var content1 = {
                parent_id: parseInt(issue_project_id),
              };
              jQuery.ajax({
                type: "PUT",
                url: `${url}/projects/${parseInt(
                  project_id
                )}.json?key=${project_api_key}`,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                  project: content1,
                }),

                success: function (result, status, xhr) {
                  // location.reload();
                  $("#project_project-" + project_id).val(issue_project_id);
                },
                error: function (xhr, status, error) {
                  console.log(
                    "Result: " +
                      status +
                      " " +
                      error +
                      " " +
                      xhr.status +
                      " " +
                      xhr.statusText
                  );
                  let content = JSON.parse(xhr.responseText).errors;
                  if (Array.isArray(content)) {
                    content.forEach((error) => {
                      toastr["error"](error);
                    });
                  } else {
                    toastr["error"](content);
                  }
                },
              });
            });
          }

          // Custom form String
          else if (clickedtd === `cf_${custom_id} string`) {
            var trId = $(this).closest("tr").attr("id");
            var regex = /-(\d+)/;
            var match = trId.match(regex);
            var project_id = match ? match[1] : null;
            $.ajax({
              type: "GET",
              url: `${url}/projects/${parseInt(
                project_id
              )}.json?key=${project_api_key}`,
              dataType: "json",
              contentType: "application/json",
              success: function (data, status, xhr) {
                var c_f_issues_ids = data.project.custom_fields;
                var cs_failed = true;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_failed = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id}`)
                      .text();
                    var old_value = get_cf_id_text;
                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input class="update_project_cf_string" size="65px" id="dynamic-edit-${currentTdClass}" maxlength="255" title="Issue custom field"
                                    placeholder="Enter custom field text..." type="text">`
                    );
                    let set_cf_id_text = document.getElementById(
                      `dynamic-edit-${currentTdClass}`
                    );
                    set_cf_id_text.value = `${get_cf_id_text}`.trim();
                    $(`.dynamic-edit-${currentTdClass}`);

                    $(`#${tdId}`).on("keypress", function (e) {
                      if (e.which == 13) {
                        var custom_field_array = [];
                        var cf_value = $(
                          `#dynamic-edit-${currentTdClass}`
                        ).val();
                        currentRow
                          .find(`td.cf_${custom_id} span.td_text`)
                          .html(cf_value);
                        $(`#${tdId}`).remove();
                        $(`td#issue_cf_${custom_id}_id-${projectId}`).css(
                          "display",
                          "revert"
                        );
                        custom_field_array.push({
                          id: custom_id,
                          value: `${cf_value}`,
                        });

                        var content1 = {
                          custom_fields: custom_field_array,
                        };

                        $.ajax({
                          type: "PUT",
                          url: `${url}/projects/${parseInt(
                            project_id
                          )}.json?key=${project_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                            project: content1,
                          }),
                          success: function (result, status, xhr) {
                            console.log("Result:", result);
                          },
                          error: function (xhr, status, error) {
                            currentRow
                              .find(`td.cf_${custom_id} span.td_text`)
                              .html(old_value);
                            if (xhr.status == 422) {
                              let content = JSON.parse(xhr.responseText).errors;
                              if (Array.isArray(content)) {
                                content.forEach((error) => {
                                  toastr["error"](error);
                                });
                              } else {
                                toastr["error"](content);
                              }
                            }
                          },
                        });
                      }
                    });
                    break;
                  } else {
                    cs_failed = true;
                  }
                }
                if (cs_failed == true) {
                  toastr["error"](
                    "This custom field is not belong to this project."
                  );
                }
              },
              error: function (xhr, status, error) {
                let content = JSON.parse(xhr.responseText).errors;
                if (Array.isArray(content)) {
                  content.forEach((error) => {
                    toastr["error"](error);
                  });
                } else {
                  toastr["error"](content);
                }
              },
            });
          }

          //Custom Float Type
          else if (clickedtd === `cf_${custom_id} float`) {
            $.ajax({
              type: "GET",
              url: `${url}/projects/${parseInt(
                project_id
              )}.json?key=${project_api_key}`,
              dataType: "json",
              contentType: "application/json",
              success: function (data, status, xhr, textStatus, jqXHR) {
                var projectt = data.project.custom_fields;
                for (var i = 0; i < projectt.length; i++) {
                  var customFieldId = projectt[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_val_text = currentRow
                      .find(`td.cf_${custom_id}`)
                      .text()
                      .trim();
                    var old_value = get_cf_val_text.trim() !== '' ? parseFloat(get_cf_val_text.trim()) : '';
                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input class="update_project_cf_float" size="6" id="dynamic-edit-${currentTdClass}" title="Issue custom field"
                                    placeholder="Enter only decimal number..." type="number" step="0.01" >`
                    );
                    let set_cf_id_text = document.getElementById(
                      `dynamic-edit-${currentTdClass}`
                    );
                    set_cf_id_text.value = old_value;
                    $(`.dynamic-edit-${currentTdClass}`);

                    $(`#${tdId}`).on("keypress", function (e) {
                      if (e.which == 13) {
                        var custom_field_array = [];
                        var cf_value = $(
                          `#dynamic-edit-${currentTdClass}`
                        ).val();
                        currentRow
                          .find(`td.cf_${custom_id} span.td_text`)
                          .html(cf_value);
                        $(`#${tdId}`).remove();
                        $(`td#issue_cf_${custom_id}_id-${projectId}`).css(
                          "display",
                          "revert"
                        );

                        custom_field_array.push({
                          id: custom_id,
                          value: cf_value,
                        });

                        var content1 = {
                          custom_fields: custom_field_array,
                        };

                        $.ajax({
                          type: "PUT",
                          url: `${url}/projects/${parseInt(
                            project_id
                          )}.json?key=${project_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                            project: content1,
                          }),
                          success: function (data, status, xhr) {
                            console.log(xhr.status);
                          },
                          error: function (xhr, status, error) {
                            currentRow
                              .find(`td.cf_${custom_id} span.td_text`)
                              .html('old_value');
                            if (xhr.status == 422) {
                              let content = JSON.parse(xhr.responseText).errors;
                              if (Array.isArray(content)) {
                                content.forEach((error) => {
                                  toastr["error"](error);
                                });
                              } else {
                                toastr["error"](content);
                              }
                            }
                          },
                        });
                      }
                    });
                    break;
                  } else {
                    cs_falid = true;
                  }
                }
                if (cs_falid == true) {
                  toastr["error"](
                    "This custom field is not belong to this project."
                  );
                }
              },
              error: function (xhr, jqXHR, status, error) {
                console.log(jqXHR, "status");
              },
            });
          }

          //Custom Integer Type
          else if (clickedtd === `cf_${custom_id} int`) {
            $.ajax({
              type: "GET",
              url: `${url}/projects/${parseInt(
                project_id
              )}.json?key=${project_api_key}`,
              dataType: "json",
              contentType: "application/json",
              success: function (data, status, xhr) {
                var c_f_issues_ids = data.project.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id}`)
                      .text();
                      var old_value = get_cf_id_text.trim() !== '' ? Number(get_cf_id_text.trim()) : '';
                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input class="update_project_cf_int" size="6" id="dynamic-edit-${currentTdClass}"
                               type="number" >`
                    );
                    let set_cf_id_text = document.getElementById(
                      `dynamic-edit-${currentTdClass}`
                    );
                    set_cf_id_text.value =old_value;
                    $(`.dynamic-edit-${currentTdClass}`);

                    $(`#${tdId}`).on("keypress", function (e) {
                      if (e.which == 13) {
                        var custom_field_array = [];
                        var cf_value = $(
                          `#dynamic-edit-${currentTdClass}`
                        ).val();
                        currentRow
                          .find(`td.cf_${custom_id} span.td_text`)
                          .html(cf_value);
                        $(cf_value).append(get_cf_id_text);
                        $(`#${tdId}`).remove();
                        $(`td#issue_cf_${custom_id}_id-${projectId}`).css(
                          "display",
                          "revert"
                        );

                        custom_field_array.push({
                          id: custom_id,
                          value: cf_value,
                        });

                        var content1 = {
                          custom_fields: custom_field_array,
                        };

                        $.ajax({
                          type: "PUT",
                          url: `${url}/projects/${parseInt(
                            project_id
                          )}.json?key=${project_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                            project: content1,
                          }),
                          success: function (result, status, xhr) {
                            // location.reload();
                          },
                          error: function (xhr, status, error) {
                            currentRow
                              .find(`td.cf_${custom_id} span.td_text`)
                              .html(old_value);
                            if (xhr.status == 422) {
                              let content = JSON.parse(xhr.responseText).errors;
                              if (Array.isArray(content)) {
                                content.forEach((error) => {
                                  toastr["error"](error);
                                });
                              } else {
                                toastr["error"](content);
                              }
                            }
                          },
                        });
                      }
                    });
                    break;
                  } else {
                    cs_falid = true;
                  }
                }
                if (cs_falid == true) {
                  toastr["error"](
                    "This custom field is not belong to this project."
                  );
                }
              },
              error: function (xhr, status, error) {},
            });
          }

          //Custom Long text
          else if (clickedtd === `cf_${custom_id} text`) {
            $.ajax({
              type: "GET",
              url: `${url}/projects/${parseInt(
                project_id
              )}.json?key=${project_api_key}`,
              dataType: "json",
              contentType: "application/json",
              success: function (data, status, xhr) {
                var c_f_issues_ids = data.project.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id}`)
                      .text();
                    var old_value = get_cf_id_text;
                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input class="update_project_cf_text" size="15" id="dynamic-edit-${currentTdClass}" maxlength="255" title="Issue custom field"
                                    placeholder="Enter custom field text..." type="text" >`
                    );
                    let set_cf_id_text = document.getElementById(
                      `dynamic-edit-${currentTdClass}`
                    );
                    set_cf_id_text.value = `${get_cf_id_text}`.trim();
                    // set_cf_id_text.setSelectionRange(set_cf_id_text.value.length, set_cf_id_text.value.length);
                    $(`.dynamic-edit-${currentTdClass}`);

                    $(`#${tdId}`).on("keypress", function (e) {
                      if (e.which == 13) {
                        var custom_field_array = [];
                        var cf_value = $(
                          `#dynamic-edit-${currentTdClass}`
                        ).val();
                        currentRow
                          .find(`td.cf_${custom_id} span.td_text`)
                          .html(cf_value);
                        // $(cf_value).append(get_cf_id_text);
                        $(`#${tdId}`).remove();
                        $(`td#issue_cf_${custom_id}_id-${projectId}`).css(
                          "display",
                          "revert"
                        );

                        custom_field_array.push({
                          id: custom_id,
                          value: `${cf_value}`,
                        });

                        var content1 = {
                          custom_fields: custom_field_array,
                        };

                        $.ajax({
                          type: "PUT",
                          url: `${url}/projects/${parseInt(
                            project_id
                          )}.json?key=${project_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                            project: content1,
                          }),
                          success: function (result, status, xhr) {
                            // location.reload();
                          },
                          error: function (xhr, status, error) {
                            currentRow
                              .find(`td.cf_${custom_id} span.td_text`)
                              .html(old_value);
                            if (xhr.status == 422) {
                              let content = JSON.parse(xhr.responseText).errors;
                              if (Array.isArray(content)) {
                                content.forEach((error) => {
                                  toastr["error"](error);
                                });
                              } else {
                                toastr["error"](content);
                              }
                            }
                          },
                        });
                      }
                    });
                    break;
                  } else {
                    cs_falid = true;
                  }
                }
                if (cs_falid == true) {
                  toastr["error"](
                    "This custom field is not belong to this project"
                  );
                }
              },
              error: function (xhr, status, error) {},
            });
          }

          //Custom User Type
          else if (clickedtd == `cf_${custom_id} user`) {
            // var currentRow;
            $.ajax({
              type: "GET",
              url: `${url}/projects/${parseInt(
                project_id
              )}.json?key=${project_api_key}`,
              dataType: "json",
              contentType: "application/json",
              success: function (data, status, xhr) {
                var c_f_issues_ids = data.project.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var old_value = currentRow
                      .find(`td.cf_${custom_id} user`)
                      .text();
                    appendAssigneeProjectList(
                      rowId,
                      currentTdClass,
                      projectId,
                      project_id
                    );
                    var currentTdClass;

                    var assigned_to_update;

                    $(`#${tdId}`).on("change", function () {
                      var custom_field_array = [];
                      // var get_cf_id_text = currentRow.find(`td.cf_${custom_id} a`).text();

                      var select_cf_user;
                      var select_cf_user_id;
                      select_cf_user = $("#assignee_to_project-" + project_id)
                        .find("option:selected")
                        .attr("title");
                      select_cf_user_id = $(
                        "#assignee_to_project-" + project_id
                      )
                        .find("option:selected")
                        .val();
                      var customSpan = currentRow.find(
                        `td.cf_${custom_id} span.td_text`
                      );
                      if (customSpan.length > 0) {
                        customSpan.html(select_cf_user);
                        if (customSpan.text().trim() === "") {
                          currentRow
                            .find(`td.cf_${custom_id} span.edit-issue`)
                            .attr("style", "margin-top: -7px; display:none");
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.edit-issue`)
                            .attr("style", "margin-top: 0px; display:none");
                        }
                      } else {
                        currentRow
                          .find(`td.cf_${custom_id}`)
                          .prepend(
                            `<span class="td_text">${select_cf_user}</span>`
                          );
                        currentRow
                          .find(`td.cf_${custom_id} span.edit-issue`)
                          .attr("style", "margin-top: 0px; display:none");
                      }

                      // $("select").css("display", "none");
                      $(`#${tdId}`).remove();
                      $(`td#issue_cf_${custom_id}_id-${projectId}`).css(
                        "display",
                        "revert"
                      );

                      //  ----------------- update values -------------------------

                      custom_field_array.push({
                        id: custom_id,
                        value: `${select_cf_user_id}`,
                      });

                      var content1 = {
                        custom_fields: custom_field_array,
                      };

                      $.ajax({
                        type: "PUT",
                        url: `${url}/projects/${parseInt(
                          project_id
                        )}.json?key=${project_api_key}`,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify({
                          project: content1,
                        }),
                        success: function (result, status, xhr) {
                          // location.reload();
                        },
                        error: function (xhr, status, error) {
                          if (customSpan.length > 0) {
                            customSpan.html(old_value);
                            if (customSpan.text().trim() === "") {
                              currentRow
                                .find(`td.cf_${custom_id} span.edit-issue`)
                                .attr(
                                  "style",
                                  "margin-top: -7px; display:none"
                                );
                            } else {
                              currentRow
                                .find(`td.cf_${custom_id} span.edit-issue`)
                                .attr("style", "margin-top: 0px; display:none");
                            }
                          } else {
                            currentRow
                              .find(`td.cf_${custom_id}`)
                              .prepend(
                                `<span class="td_text">${old_value}</span>`
                              );
                            currentRow
                              .find(`td.cf_${custom_id} span.edit-issue`)
                              .attr("style", "margin-top: 0px; display:none");
                          }
                          let content = JSON.parse(xhr.responseText).errors;
                          if (Array.isArray(content)) {
                            content.forEach((error) => {
                              toastr["error"](error);
                            });
                          } else {
                            toastr["error"](content);
                          }
                          console.log(
                            "Result: " +
                              status +
                              " " +
                              error +
                              " " +
                              xhr.status +
                              " " +
                              xhr.statusText
                          );
                        },
                      });
                    });
                    break;
                  } else {
                    cs_falid = true;
                  }
                }
                if (cs_falid == true) {
                  toastr["error"](
                    "This custom field is not belong to this project"
                  );
                }
              },
              error: function (xhr, status, error) {},
            });
          }

          //Custom Link Type
          else if (clickedtd === `cf_${custom_id} link`) {
            $.ajax({
              type: "GET",
              url: `${url}/projects/${parseInt(
                project_id
              )}.json?key=${project_api_key}`,
              dataType: "json",
              contentType: "application/json",
              success: function (data, status, xhr) {
                var c_f_issues_ids = data.project.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id} a`)
                      .text();
                    var old_value = get_cf_id_text;
                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input class="update_project_update_cf_link" size="15" id="dynamic-edit-${currentTdClass}" title="Issue custom field"
                                    placeholder="Enter http address..." type="text" >`
                    );
                    let set_cf_id_text = document.getElementById(
                      `dynamic-edit-${currentTdClass}`
                    );
                    set_cf_id_text.value = `${get_cf_id_text}`;
                    $(`.dynamic-edit-${currentTdClass}`);

                    $(`#${tdId}`).on("keypress", function (e) {
                      if (e.which == 13) {
                        var custom_field_array = [];
                        var cf_value = $(
                          `#dynamic-edit-${currentTdClass}`
                        ).val();
                        const tdElement = currentRow.find(`td.cf_${custom_id}`);
                          let aTag = tdElement.find('a');
                          if (aTag.length === 0) {
                            aTag = $('<a></a>').html(cf_value);
                            tdElement.prepend(aTag);
                          } else {
                            aTag.html(cf_value);
                          }
                        $(`#${tdId}`).remove();
                        $(`td#issue_cf_${custom_id}_id-${projectId}`).css(
                          "display",
                          "revert"
                        );

                        custom_field_array.push({
                          id: custom_id,
                          value: `${cf_value}`,
                        });

                        var content1 = {
                          custom_fields: custom_field_array,
                        };

                        $.ajax({
                          type: "PUT",
                          url: `${url}/projects/${parseInt(
                            project_id
                          )}.json?key=${project_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                            project: content1,
                          }),
                          success: function (result, status, xhr) {
                            // location.reload();
                          },
                          error: function (xhr, status, error) {
                            currentRow
                              .find(`td.cf_${custom_id} a`)
                              .html(old_value);
                            if (xhr.status == 422) {
                              let content = JSON.parse(xhr.responseText).errors;
                              if (Array.isArray(content)) {
                                content.forEach((error) => {
                                  toastr["error"](error);
                                });
                              } else {
                                toastr["error"](content);
                              }
                            }
                          },
                        });
                      }
                    });
                    break;
                  } else {
                    cs_falid = true;
                  }
                }
                if (cs_falid == true) {
                  toastr["error"](
                    "This custom field is not belong to this project."
                  );
                }
              },
              error: function (xhr, status, error) {},
            });
          }

          //Custom Integer Type

          // Custom Date Type
          else if (clickedtd === `cf_${custom_id} date`) {
            var trId = $(this).closest("tr").attr("id");
            var regex = /-(\d+)/;
            var match = trId.match(regex);
            var project_id = match ? match[1] : null;
            $.ajax({
              type: "GET",
              url: `${url}/projects/${parseInt(
                project_id
              )}.json?key=${project_api_key}`,
              dataType: "json",
              contentType: "application/json",
              success: function (data, status, xhr) {
                var c_f_issues_ids = data.project.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id}`)
                      .text()
                      .split("\n")[0];
                    var originalValue = get_cf_id_text;
                    var cf_date = changeFormat(
                      get_cf_id_text,
                      selected_date_format
                    );

                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input id="dynamic-edit-${currentTdClass}" type="date" >`
                    );
                    let set_cf_id_text = document.getElementById(
                      `dynamic-edit-${currentTdClass}`
                    );
                    set_cf_id_text.value = `${cf_date}`;
                    $(`#${tdId}`).on("change", function (e) {
                      var custom_field_array = [];
                      var cf_value = $(`#dynamic-edit-${currentTdClass}`).val();
                      if (selected_date_format === "YYYY-MM-DD") {
                        if (cf_value) {
                          var dateParts = cf_value.split("-");
                          var changeDateFormate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(changeDateFormate);
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html("");
                        }
                      } else if (selected_date_format === "DD/MM/YYYY") {
                        if (cf_value) {
                          var dateParts = cf_value.split("-");
                          var changeDateFormate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(changeDateFormate);
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html("");
                        }
                      } else if (selected_date_format === "MM/DD/YYYY") {
                        if (cf_value) {
                          var dateParts = cf_value.split("-");
                          var changeDateFormate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(changeDateFormate);
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html("");
                        }
                      } else if (selected_date_format === "DD-MM-YYYY") {
                        if (cf_value) {
                          var dateParts = cf_value.split("-");
                          var changeDateFormate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(changeDateFormate);
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html("");
                        }
                      } else if (selected_date_format === "MM/DD/YYYY") {
                        if (cf_value) {
                          var dateParts = cf_value.split("-");
                          var changeDateFormate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(changeDateFormate);
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html("");
                        }
                      } else if (selected_date_format === "DD %b YYYY") {
                        if (cf_value) {
                          var dateObj = new Date(cf_value);
                          var day = dateObj.getDate();
                          var month = dateObj.toLocaleString("en-us", {
                            month: "short",
                          });
                          var year = dateObj.getFullYear();
                          var changeDateFormat = `${day} ${month} ${year}`;
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(changeDateFormat);
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html("");
                        }
                      } else if (selected_date_format === "DD %B YYYY") {
                        if (cf_value) {
                          var dateObj = new Date(cf_value);
                          var day = dateObj.getDate();
                          var month = dateObj.toLocaleString("en-us", {
                            month: "long",
                          });
                          var year = dateObj.getFullYear();
                          var changeDateFormat = `${day} ${month} ${year}`;
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(changeDateFormat);
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html("");
                        }
                      } else if (selected_date_format === "%b DD, YYYY") {
                        if (cf_value) {
                          var dateObj = new Date(cf_value);
                          var options = {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          };
                          var changeDateFormat = dateObj.toLocaleDateString(
                            "en-US",
                            options
                          );
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(changeDateFormat);
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html("");
                        }
                      } else if (selected_date_format === "%B DD, YYYY") {
                        if (cf_value) {
                          var dateObj = new Date(cf_value);
                          var options = {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          };
                          var changeDateFormat = dateObj.toLocaleDateString(
                            "en-US",
                            options
                          );
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(changeDateFormat);
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html("");
                        }
                      } else if (selected_date_format === "DD.MM.YYYY") {
                        if (cf_value) {
                          var dateParts = cf_value.split("-");
                          var changeDateFormat = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(changeDateFormat);
                        } else {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html("");
                        }
                      }

                      $(cf_value).append(get_cf_id_text);
                      $(`#${tdId}`).remove();
                      $(`td#issue_cf_${custom_id}_id-${projectId}`).css(
                        "display",
                        "revert"
                      );

                      custom_field_array.push({
                        id: custom_id,
                        value: `${cf_value}`,
                      });

                      var content1 = {
                        custom_fields: custom_field_array,
                      };

                      $.ajax({
                        type: "PUT",
                        url: `${url}/projects/${parseInt(
                          project_id
                        )}.json?key=${project_api_key}`,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify({
                          project: content1,
                        }),
                        success: function (result, status, xhr) {
                          // location.reload();
                        },
                        error: function (xhr, status, error) {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html(originalValue);
                          console.log(
                            "Result: " +
                              status +
                              " " +
                              error +
                              " " +
                              xhr.status +
                              " " +
                              xhr.statusText
                          );
                          let content = JSON.parse(xhr.responseText).errors;
                          if (Array.isArray(content)) {
                            content.forEach((error) => {
                              toastr["error"](error);
                            });
                          } else {
                            toastr["error"](content);
                          }
                        },
                      });
                    });
                    break;
                  } else {
                    cs_falid = true;
                  }
                }
                if (cs_falid == true) {
                  toastr["error"](
                    "This custom field is not belong to this project"
                  );
                }
              },
              error: function (xhr, status, error) {},
            });
          }

          //Custom boolean Type
          else if (clickedtd === `cf_${custom_id} bool`) {
            getCustomData(rowId, currentTdClass, project_id, projectId);
            $(`#${tdId}`).on("change", function () {
              var custom_field_array = [];

              var select_cf_list;
              var select_cf_list_id;
              select_cf_list = $("#cf_bool_project-" + project_id)
                .find("option:selected")
                .attr("title");

              select_cf_list_id = $("#cf_bool_project-" + project_id)
                .find("option:selected")
                .val();

              currentRow
                .find(`td.cf_${custom_id} span.td_text`)
                .html(select_cf_list);

              $(`#${tdId}`).remove();
              $(`td#issue_cf_${custom_id}_id-${project_id}`).css(
                "display",
                "revert"
              );

              custom_field_array.push({
                id: custom_id,
                value: `${select_cf_list_id}`,
              });

              var content1 = {
                custom_fields: custom_field_array,
              };

              $.ajax({
                type: "PUT",
                url: `${url}/projects/${parseInt(
                  project_id
                )}.json?key=${project_api_key}`,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                  project: content1,
                }),
                success: function (result, status, xhr) {
                  //  location.reload();
                },
                error: function (xhr, status, error) {
                  currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html('');
                  let content = JSON.parse(xhr.responseText).errors;
                  if (Array.isArray(content)) {
                    content.forEach((error) => {
                      toastr["error"](error);
                    });
                  } else {
                    toastr["error"](content);
                  }
                  console.log(
                    "Result: " +
                      status +
                      " " +
                      error +
                      " " +
                      xhr.status +
                      " " +
                      xhr.statusText
                  );
                },
              });
            });
          }

          //project custom versions
          else if (clickedtd == `cf_${custom_id} version`) {
            $.ajax({
              type: "GET",
              url: `${url}/projects/${parseInt(
                project_id
              )}.json?key=${project_api_key}`,
              dataType: "json",
              contentType: "application/json",
              success: function (data, status, xhr) {
                var c_f_issues_ids = data.project.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    versionDropdown(
                      rowId,
                      currentTdClass,
                      projectId,
                      project_id
                    );
                    var currentTdClass;
                    // var currentRow;
                    $(`#${tdId}`).on("change", function () {
                      var custom_field_array = [];
                      var select_cf_version;
                      var select_cf_version_id;
                      select_cf_version = $("#version_project-" + project_id)
                        .find("option:selected")
                        .attr("title");
                      select_cf_version_id = $("#version_project-" + project_id)
                        .find("option:selected")
                        .val();

                      currentRow
                        .find(`td.cf_${custom_id} span.td_text`)
                        .html(select_cf_version);
                      $(`#${tdId}`).remove();
                      $(`td#issue_cf_${custom_id}_id-${project_id}`).css(
                        "display",
                        "revert"
                      );

                      custom_field_array.push({
                        id: custom_id,
                        value: select_cf_version_id,
                      });
                      var content1 = {
                        custom_fields: custom_field_array,
                      };
                      $.ajax({
                        type: "PUT",
                        url: `${url}/projects/${parseInt(
                          project_id
                        )}.json?key=${project_api_key}`,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify({
                          project: content1,
                        }),
                        success: function (result, status, xhr) {
                          // location.reload();
                        },
                        error: function (xhr, status, error) {
                          currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html('');
                          let content = JSON.parse(xhr.responseText).errors;
                          if (Array.isArray(content)) {
                            content.forEach((error) => {
                              toastr["error"](error);
                            });
                          } else {
                            toastr["error"](content);
                          }
                          console.log(
                            "Result: " +
                              status +
                              " " +
                              error +
                              " " +
                              xhr.status +
                              " " +
                              xhr.statusText
                          );
                        },
                      });
                    });
                    break;
                  } else {
                    cs_falid = true;
                  }
                }
                if (cs_falid == true) {
                  toastr["error"](
                    "This custom field is not belong to this project"
                  );
                }
              },
              error: function (xhr, status, error) {},
            });
          }
          // Custom List Type
          else if (clickedtd === `cf_${custom_id} list`) {
            getCustomData(rowId, currentTdClass, projectId, project_id);

            $(`#${tdId}`).on("change", function () {
              var custom_field_array = [];

              var select_cf_list;
              var select_cf_list_id;
              select_cf_list = $("#cf_list_project-" + projectId)
                .find("option:selected")
                .attr("title");
              select_cf_list_id = $("#cf_list_project-" + projectId)
                .find("option:selected")
                .val();
              currentRow
                .find(`td.cf_${custom_id} span.td_text`)
                .html(select_cf_list);
              $(`#${tdId}`).remove();
              $(`td#issue_cf_${custom_id}_id-${projectId}`).css(
                "display",
                "revert"
              );

              custom_field_array.push({
                id: custom_id,
                value: `${select_cf_list_id}`,
              });

              var content1 = {
                custom_fields: custom_field_array,
              };

              $.ajax({
                type: "PUT",
                url: `${url}/projects/${parseInt(
                  project_id
                )}.json?key=${project_api_key}`,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                  project: content1,
                }),
                success: function (result, status, xhr) {
                  // location.reload();
                },
                error: function (xhr, status, error) {
                  let content = JSON.parse(xhr.responseText).errors;
                  currentRow
                            .find(`td.cf_${custom_id} span.td_text`)
                            .html('');
                  if (Array.isArray(content)) {
                    content.forEach((error) => {
                      toastr["error"](error);
                    });
                  } else {
                    toastr["error"](content);
                  }
                  console.log(
                    "Result: " +
                      status +
                      " " +
                      error +
                      " " +
                      xhr.status +
                      " " +
                      xhr.statusText
                  );
                },
              });
            });
          }
        });
      }
    });

    //version dropdown
    function versionDropdown(rowId, currentTdClass, projectId, project_id) {
      var version_id;

      $.ajax({
        url: `${url}/projects/${parseInt(
          project_id
        )}.json?key=${project_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        // data: { limit: 100 },
        success: function (data) {
          var project_data = data.project;
          version_id = project_data.id;

          $.ajax({
            url: `${url}/projects/${version_id}/versions.json?key=${project_api_key}`,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (data) {
              var rowtext = $(`tr#${rowId}`)
                .find("td.version span.td_text")
                .text();
              var issue_version_parts = rowtext.trim().split(" - ");
              var issue_version =
                issue_version_parts.length > 1
                  ? issue_version_parts[1]
                  : issue_version_parts[0];

              versions = data.versions;
              var versionDropdown = "<select id= version_" + rowId + ">";

              if (issue_version === "") {
                versionDropdown += `<option value="" selected title=""></option>`;
              } else {
                versionDropdown += `<option value="" title=""></option>`;
              }

              for (var i = 0; i < versions.length; i++) {
                var version_id = versions[i].id;
                var version_name = versions[i].name;
                var display_name = version_name;

                if (version_name.length > 20) {
                  display_name = version_name.substring(0, 20) + "...";
                }

                versionDropdown +=
                  `<option value="${version_id}" ${
                    issue_version == version_name ? "selected" : ""
                  } title="${version_name}">` +
                  display_name +
                  "</option>";
              }

              $(`tr#${rowId} td#${tdId}`).append(versionDropdown);
              if ($(`select#version_${rowId} option`).length == 1) {
                toastr["error"]("This project does not have a fixed version.");
                $(`#version_${rowId}`).css("display", "none");
              }
            },
            error: function () {},
          });
        },
        error: function () {},
      });
    }

    // ----------------- custom data --------------
    function getCustomData(rowId, currentTdClass, projectId, project_id) {
      var cf_valid = false;
      $.ajax({
        url: `${url}/projects/${parseInt(
          project_id
        )}.json?key=${project_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (data) {
          var project_data = data.project;
          var c_f_issue = project_data.custom_fields;
          var project_idds = project_data.id;
          $.ajax({
            type: "GET",
            url: `${url}/custom_fields.json?key=${project_api_key}`,
            dataType: "json",
            async: false,
            success: function (result, index, xhr) {
              var rowtext = $(`tr#${rowId}`).find(`td.cf_${custom_id}`).text();
              var issue_cf = rowtext.split("\n")[0];
              var custom_cf_Dropdown;
              var custom_cf_Dropdown_bool;
              result.custom_fields.forEach((data, index) => {
                if (data.customized_type === "project") {
                  if (data.id == custom_id) {
                    if (data.field_format == "list") {
                      var cf_list = data.possible_values;
                      for (let i = 0; i < c_f_issue.length; i++) {
                        var cf_issue_ids = c_f_issue[i].id;
                        if (cf_issue_ids == custom_id) {
                          cf_valid = false;
                          custom_cf_Dropdown =
                            "<select id= cf_list_" + rowId + ">";
                          custom_cf_Dropdown =
                            "<select id= cf_list_" + rowId + ">";
                          if (issue_cf === "") {
                            custom_cf_Dropdown += `<option value="" selected title=""></option>`;
                          } else {
                            custom_cf_Dropdown += `<option value="" title=""></option>`;
                          }
                          for (let i = 0; i < cf_list.length; i++) {
                            var display_label = cf_list[i].label;
                            if (display_label.length > 20) {
                              display_label =
                                display_label.substring(0, 20) + "...";
                            }
                            custom_cf_Dropdown +=
                              `<option ${
                                issue_cf == cf_list[i].label ? "selected" : ""
                              } value = ${cf_list[i].value} title="${
                                cf_list[i].label
                              }">` +
                              display_label +
                              "</option>";
                          }
                          break;
                        } else {
                          cf_valid = true;
                        }
                      }
                      if (cf_valid == true) {
                        toastr["error"](
                          "This custom field is not belong to this project"
                        );
                      }
                    } else if (data.field_format == "bool") {
                      var cf_bool = data.possible_values;
                      for (let i = 0; i < c_f_issue.length; i++) {
                        var cf_issue_bool_ids = c_f_issue[i].id;

                        if (cf_issue_bool_ids == custom_id) {
                          cf_valid = false;
                          custom_cf_Dropdown =
                            "<select id= cf_bool_" + rowId + ">";
                          if (issue_cf === "") {
                            custom_cf_Dropdown += `<option value="" selected title=""></option>`;
                          } else {
                            custom_cf_Dropdown += `<option value="" title=""></option>`;
                          }
                          for (let i = 0; i < cf_bool.length; i++) {
                            var display_label = cf_bool[i].label;
                            if (display_label.length > 20) {
                              display_label =
                                display_label.substring(0, 20) + "...";
                            }
                            custom_cf_Dropdown +=
                              `<option ${
                                issue_cf == cf_bool[i].label ? "selected" : ""
                              } value = ${cf_bool[i].value} title="${
                                cf_bool[i].label
                              }">` +
                              display_label +
                              "</option>";
                          }
                          break;
                        } else {
                          cf_valid = true;
                        }
                      }
                      if (cf_valid == true) {
                        toastr["error"](
                          "This custom field is not belong to this project"
                        );
                      }
                    }
                  }
                }
              });
              $(`tr#${rowId} td#${tdId}`).append(custom_cf_Dropdown);
            },
          });
        },
        error: function () {},
      });
    }

    function appendAssigneeProjectList(
      rowId,
      currentTdClass,
      projectId,
      project_id
    ) {
      // var project_id;
      var projectId;
      $.ajax({
        url: `${url}/projects/${parseInt(
          project_id
        )}.json?key=${project_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        data: { limit: 200 },
        success: function (data) {
          var project_data = data.project;
          project_id = project_data.id;

          $.ajax({
            url: `${url}/projects/${parseInt(
              project_id
            )}/active_memberss.json?key=${project_api_key}`,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (data) {
              var rowtext = $(`tr#${rowId}`)
                .find(`td.user span.td_text`)
                .text();
              var issue_assignee = rowtext.trim();
              var members = data.active_members;

              var memberDropdown = "<select id= assignee_to_" + rowId + ">";
              if (issue_assignee === "") {
                memberDropdown += `<option value="" selected title=""></option>`;
              } else {
                memberDropdown += `<option value="" title=""></option>`;
              }
              for (var i = 0; i < members.length; i++) {
                var member_id = members[i].id;
                var member_name = members[i].name;
                var display_name = member_name;

                if (member_name.length > 20) {
                  display_name = member_name.substring(0, 20) + "...";
                }

                memberDropdown +=
                  `<option value="${member_id}" ${
                    issue_assignee == member_name ? "selected" : ""
                  } title="${member_name}">` +
                  display_name +
                  "</option>";
              }

              $(`tr#${rowId} td#${tdId}`).append(memberDropdown);
              if ($(`select#assignee_to_${rowId} option`).length == 1) {
                toastr["error"]("This project does not have a assignee");
                $(`#assignee_to_${rowId}`).css("display", "none");
              }
            },
            error: function () {},
          });
        },
        error: function () {},
      });
    }

    function appendParentProjectDropdown(
      rowId,
      currentTdClass,
      selectedProject,
      project_id
    ) {
      var trId = $(this).closest("tr").attr("id");
      var trId = rowId;
      var regex = /-(\d+)/;
      var match = trId.match(regex);
      var project_id = match ? match[1] : null;

      $.ajax({
        url: `${url}/projects.json?key=${project_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        data: { limit: 100 },
        success: function (data) {
          var rowtext = $(`tr#${rowId}`)
            .find("td.parent_id span.td_text")
            .text();
          var issue_project = rowtext.trim();

          var projects = data.projects || [];

          var projectDropdown = "<select id='project_" + rowId + "'>";

          // Add empty option only if projects are available
          if (projects.length > 0) {
            projectDropdown += `<option value="" title=""></option>`;
          }

          if (projects.length === 0) {
            projectDropdown += "<option disabled>No projects found</option>";
          } else {
            projects.forEach(function (project) {
              if (project.id !== parseInt(selectedProject)) {
                var projectName = project.name;
                if (projectName.length > 20) {
                  projectName = projectName.substring(0, 20) + "...";
                }
                projectDropdown += `<option ${
                  issue_project == project.name ? "selected" : ""
                } value="${project.id}" title="${project.name}">
                                       ${projectName}
                                     </option>`;
              }
            });
          }

          projectDropdown += "</select>";
          $(`tr#${rowId} td#${tdId}`).append(projectDropdown);
        },

        error: function () {},
      });
    }
  }
});

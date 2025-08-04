/* eslint-disable no-dupe-else-if */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
$(document).ready(function () {
  if ($("body").hasClass("controller-issues")) {
    var issue_api_key = localStorage.getItem("issue_table_api_key");
    var selected_date_format = localStorage.getItem("dateFormat");
    var tdId = "";
    var custom_id;
    $(document).ready(function () {
      var svg_pencil = `<svg width="12" height="14" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M19.6045 5.2808L17.8579 7.02704L13.8584 3.02715L15.6613 1.22427C16.112 0.773551 16.9568 0.773551 17.4642 1.22427L19.7173 3.47742C20.1114 3.98472 20.1114 4.77339 19.6045 5.28069L19.6045 5.2808Z" fill="#1D273C"/>
       <path d="M1.46498 15.4773C3.15509 16.3221 4.56343 17.7304 5.40823 19.3644L0 20.8855L1.46498 15.4773ZM6.25313 18.6319C5.35171 16.9418 3.94336 15.4773 2.25325 14.632L13.0693 3.81592L17.0692 7.81581L6.25313 18.6319Z" fill="#1D273C"/>
       </svg>`;

      var parentContainer = document.querySelector(
        ".controller-issues.action-index"
      );
      if (parentContainer) {
        var trackerCells = parentContainer.querySelectorAll(
          "td.tracker, td.priority, td.start_date, td.category, td.estimated_hours, td.due_date , td.int , td.string , td.date , td.list , td.user , td.float , td.bool , td.text , td.version,td.story_points, td.status"
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
        ".controller-issues.action-index .list.issues tr:not(.group.open) td"
      ).each(function (e) {
        if (permission_issue_status == "true") {
          var $this = $(this);

          if ($this.hasClass("story_points")) {
            var trClass = $this.closest("tr").attr("class");
            var trTrackerNumber = trClass.match(/tracker-(\d+)/)[1];
            if (
              trTrackerNumber === story_points_tracker ||
              story_points_tracker === ""
            ) {
              $this.append(
                '<span class="edit-issue">' + svg_pencil + "</span>"
              );
              $(".edit-issue").css("display", "none");

              $this.hover(
                function () {
                  $(this)
                    .children(".edit-issue")
                    .css("display", "inline-block");
                },
                function () {
                  $(this).children(".edit-issue").hide();
                }
              );
            }
          } else if (
            !(
              $this.hasClass("author") ||
              $this.hasClass("created_on") ||
              $this.hasClass("updated_on") ||
              $this.hasClass("checkbox") ||
              $this.hasClass("id") ||
              $this.hasClass("todo") ||
              $this.hasClass("buttons") ||
              $this.hasClass("author") ||
              $this.hasClass("created_on") ||
              $this.hasClass("closed_on") ||
              $this.hasClass("parent") ||
              $this.hasClass("parent-subject") ||
              $this.hasClass("closed") ||
              $this.hasClass("spent_hours") ||
              $this.hasClass("total_spent_hours") ||
              $this.hasClass("total_estimated_hours") ||
              $this.hasClass("relations") ||
              $this.hasClass("last_updated_by") ||
              $this.hasClass("is_private") ||
              $this.hasClass("attachment") ||
              $this.hasClass("attachments") ||
              $this.hasClass("enumeration") ||
              $this.hasClass("tags")
            )
          ) {
            $this.append('<span class="edit-issue">' + svg_pencil + "</span>");
            $(".edit-issue").css("display", "none");

            $("td > span.edit-issue:only-child").css("margin-top", "-7px");
            $("td > span.td_text:empty")
              .siblings("span.edit-issue")
              .css("margin-top", "-7px");

            // Add hover to show/hide the edit issue span
            $this.hover(
              function () {
                $(this).children(".edit-issue").css("display", "inline-block");
              },
              function () {
                $(this).children(".edit-issue").hide();
              }
            );
          }
          $(".edit-issue")
            .not(".story_points .edit-issue")
            .on("click", function () {
              $("select[id^='story_points-']").hide();
              $(".td_text").show();
            });
        }
      });

      //----------------append paercentage-------------

      $("tr[id^='issue-'] td.done_ratio").each(function () {
        var $percentP = $(this).find("p.percent");
        var $closedTd = $(this).find(".closed");
        var titleValue = $closedTd.attr("title");
        var percentage = parseInt(titleValue);
        if (isNaN(percentage)) {
          percentage = 0;
        }
        var percentageP = `<label>${percentage}%</label>`;
        $percentP.after(percentageP);
      });

      // -------------- Toaster Validation ---------------
      toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "2000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
      };

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

      var cs_falid = false;
      var issueId;
      var currentTdClass;
      var projectId;
      var project_val;

      $(".edit-issue").on("click", function (e) {
        $(this).closest("tr").removeClass("hascontextmenu");
        var currentRow = $(this).closest("tr");
        var currentColumn = $(this).closest("td");
        var Id = currentRow.find("td.id").text();
        var issue_id = Id;
        issueId = parseInt(issue_id);

        var clickedtd = $(this).closest("td").attr("class");

        var clickedtd_split = clickedtd.split(" ")[0];

        var cf_Id = clickedtd.substring(3, 5);

        if (tdId != "") {
          $(`#${tdId}`).remove();
          var data = tdId.split("-");
          $(`td#issue_${data[1]}_id-${data[3]}`).css("display", "revert");
        }

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
        tdId = `dynamic-${clickedtd_split}-edit-${issueId}`;

        $(currentRow)
          .find(currentColumn)
          .attr("id", `issue_${clickedtd_split}_id-${issueId}`);
        currentTdClass = $(this).closest("td").attr("id");

        project_name = currentRow.find("td.project").text();
        projectId = currentRow.find("td.id").text();

        
        if(clickedtd_split != 'story_points'){
          $(".edit-issue").css("display", "none");
          $(`<td id = ${tdId}></td>`).insertAfter("#" + currentTdClass);
          currentRow.find("td#" + currentTdClass).css("display", "none");
          $(this).css("display", "none");
        }
        

        // ------------- Project ----------------

        if (clickedtd_split == "project") {
          var temp_this = this;
          appendProjectDropdown(
            rowId,
            currentTdClass,
            projectId,
            issueId,
            this
          );
          var currentTdClass;

          $(`#${tdId}`).on("change", function () {
            // var project_val = currentRow.find("td.project a").text();

            var select_project;
            var issue_project_id;
            select_project = $("#project_issue-" + issueId)
              .find("option:selected")
              .attr("title");

            issue_project_id = $("#project_issue-" + issueId)
              .find("option:selected")
              .val();

            currentRow.find("td.project a").html(select_project);

            $(`#${tdId}`).remove();
            $(`tr td#issue_project_id-${issueId}`).css("display", "revert");

            var content1 = {
              project_id: parseInt(issue_project_id),
            };

            jQuery.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),

              success: function (result, status, xhr) {
                $(temp_this).closest("tr").addClass("hascontextmenu");
                // location.reload();
              },

              error: function (xhr, status, error) {
                $(temp_this).closest("tr").addClass("hascontextmenu");
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
        // ------------- Tracker --------------
        else if (clickedtd_split == "tracker") {
          $(`td#issue_project_id-${issueId}`).css("display", "revert");
          $(`#dynamic-project-edit-${issueId}`).remove();

          trackerDropdown(rowId, currentTdClass, projectId, issueId);
          var currentTdClass;
          // var currentRow;
          $(`#${tdId}`).on("change", function () {
            var select_tracker;
            var select_tracker_id;
            select_tracker = $("#tracker_issue-" + issueId)
              .find("option:selected")
              .html();
            select_tracker_id = $("#tracker_issue-" + issueId)
              .find("option:selected")
              .val();

            currentRow.find("td.tracker span.td_text").html(select_tracker);
            $(`#${tdId}`).remove();
            $(`td#issue_tracker_id-${issueId}`).css("display", "revert");

            var content1 = {
              tracker_id: parseInt(select_tracker_id),
            };

            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                // location.reload();
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
              },
            });
          });
        }

        // ------------Storypoint---------------------//

        else if (clickedtd_split === "story_points") {
          async function handleStoryPoints(self) {
            const isPluginEnabled = await checkPluginEnabled(issueId);
            if (!isPluginEnabled) {
              toastr["error"]("Agile board plugin is not enabled for this issue.");
            }else{
                var storyPointsArray = story_points_val.split(",");
                var $td = $(self).closest("td");
                $td.show();
                var currentStoryPoints = $td.find(".td_text").text().trim();
                function populateDropdown(storyPointsArray, currentStoryPoints) {
                  var dropdown = $("<select>", { id: "story_points-" + issueId });
                  dropdown.append($("<option>", { value: "", text: "" }));
                  $.each(storyPointsArray, function (index, value) {
                    dropdown.append(
                      $("<option></option>").attr("value", value).text(value)
                    );
                  });
                  dropdown.val(currentStoryPoints);
                  return dropdown;
                }
                $("select[id^='story_points-']").hide();
                $(".td_text").show();
                var $tdText = $td.find(".td_text").hide();
                var $dropdown = $td.find("select").css("display", "inline-block");
                var $originalElements = $(self)
                  .closest("td")
                  .find(".edit-issue")
                  .clone(true);
                
                $td.hover(function () {
                  if ($(this).find("select").css("display") === "inline-block") {
                    $(this).find(".edit-issue").hide();
                  }
                });
            
                $dropdown = populateDropdown(storyPointsArray, currentStoryPoints);
                $td.empty().append($tdText, $originalElements, $dropdown);
            
                // Save the story points when the selection changes
                $dropdown.on("change", function () {
                  var selectedStoryPoints = $(this).val();
                  $tdText.text(selectedStoryPoints).show();
                  $dropdown.hide();
            
                  // Prepare data for API request
                  var content = {
                    issue: {
                      story_points: selectedStoryPoints,
                    },
                  };
                  $.ajax({
                    type: "PUT",
                    url: `${url}/issues/${issue_id}.json?key=${issue_api_key}`,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(content),
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
            });
          }
          }
          handleStoryPoints(this);
        }
        // -------story point end------------//
        else if (clickedtd_split == "status") {
          var currentTr = this;
          statusDropdown(rowId, currentTdClass, projectId, issueId, tdId);
          var currentTdClass;
          $(`#${tdId}`).on("change", function () {
            var select_status;
            var select_status_id;
            select_status = $("#status_issue-" + issueId)
              .find("option:selected")
              .html();
            select_status_id = $("#status_issue-" + issueId)
              .find("option:selected")
              .val();
            currentRow.find("td.status span.td_text").html(select_status);
            $(`#${tdId}`).remove();
            $(`td#issue_status_id-${issueId}`).css("display", "revert");
            var content1 = {
              status_id: parseInt(select_status_id),
            };
            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                // location.reload();
                $(currentTr).closest("tr").addClass("hascontextmenu");
              },
              error: function (xhr, status, error) {
                $(currentTr).closest("tr").addClass("hascontextmenu");
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
        //----------- Priorty -------------------------
        else if (clickedtd_split == "priority") {
          $(`td#issue_tracker_id-${issueId}`).css("display", "revert");
          $(`#dynamic-tracker-edit-${issueId}`).remove();
          priorityDropdown(rowId, currentTdClass, issueId);

          $(`#${tdId}`).on("change", function () {
            // var priority_val = currentRow.find("td.priority").text();

            var select_priorty;
            var select_priorty_id;
            select_priorty = $("#priority_issue-" + issueId)
              .find("option:selected")
              .html();
            select_priorty_id = $("#priority_issue-" + issueId)
              .find("option:selected")
              .val();

            currentRow.find("td.priority span.td_text").html(select_priorty);

            $(`#${tdId}`).remove();
            $(`td#issue_priority_id-${issueId}`).css("display", "revert");

            //  ---------- Update values --------------

            var content1 = {
              priority_id: parseInt(select_priorty_id),
            };

            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                // location.reload();
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
              },
            });
          });
        } else if (clickedtd_split == "assigned_to") {
          var temp_this = this;
          appendAssignee(rowId, currentTdClass, issueId,temp_this);

          var currentTdClass;

          // var currentRow;

          $(`#${tdId}`).on("change", function () {
            var assigned_to_update = $("#assignee_to_issue-" + issueId)
              .find("option:selected")
              .val();

            var select_assigned_to;
            select_assigned_to = $(`#assignee_to_issue-${issueId}`)
              .find("option:selected")
              .html();

            var assignedToLink = currentRow.find("td.assigned_to a");

            if (assignedToLink.length > 0) {
              assignedToLink.html(select_assigned_to);
              if (assignedToLink.text().trim() === "") {
                currentRow
                  .find("td.assigned_to span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              } else {
                currentRow
                  .find("td.assigned_to span.edit-issue")
                  .attr("style", "margin-top: 0px; display:none ");
              }
            } else {
              var anchorTag = `<a class="user active" href="#" >${select_assigned_to}</a>`;
              currentRow.find("td.assigned_to").prepend(anchorTag);
              currentRow
                .find("td.assigned_to span.edit-issue")
                .attr("style", "margin-top: 0px; display:none ");
            }

            $(`#${tdId}`).remove();
            $(`td#issue_assigned_to_id-${issueId}`).css("display", "revert");

            //------------------- Update value -------------------------

            var content1 = {
              assigned_to_id: assigned_to_update,
            };

            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                $(temp_this).closest("tr").addClass("hascontextmenu");
                // location.reload();
              },
              error: function (xhr, status, error) {
                $(temp_this).closest("tr").addClass("hascontextmenu");
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
        // -------------------Estimated Hours----------------
        else if (clickedtd_split == "estimated_hours") {
          // Get the current estimated time (in either HH:mm or decimal format)
          var get_estimated_time = currentRow.find("td.estimated_hours").text();
      
          // Append the input field for estimated hours
          $(`tr#${rowId} td#${tdId}`).append(
              `<input size="6" id="dynamic-edit-${currentTdClass}" title="Issue estimated hours" type="text">`
          );
      
          // Set the initial value to the current estimated time (if available)
          let set_estimated_time = document.getElementById(`dynamic-edit-${currentTdClass}`);
          set_estimated_time.value = `${get_estimated_time}`.trim();
      
          // Handle the 'Enter' keypress
          $(`#${tdId}`).on("keypress", function (e) {
              if (e.which == 13) {
                  var estimated_time = $(`#dynamic-edit-${currentTdClass}`).val().trim();
      
                  // Helper function to convert HH:mm to decimal hours
                  function convertHHMMToDecimal(time) {
                      let [hours, minutes] = time.split(":").map(Number);
                      return hours + (minutes / 60); // Convert minutes to fraction of an hour
                  }
      
                  // Helper function to convert decimal hours to HH:mm format
                  function convertToHHMM(time) {
                      let hours = Math.floor(time); // Get the integer part (hours)
                      let minutes = Math.round((time - hours) * 60); // Convert the decimal part to minutes
                      return `${hours}:${minutes.toString().padStart(2, '0')}`; // Format as HH:mm
                  }
      
                  // Prepare the content for saving and validate the input
                  var content1 = {};
                  let flag = false;
      
                  // Handle empty input case (allow saving empty string)
                  if (estimated_time === "") {
                      content1.estimated_hours = ""; // Save empty value
                      flag = true;
                  } else {
                      let isHHMMFormat = /^\d{1,2}:\d{2}$/.test(estimated_time); // Check for HH:mm format
                      let isDecimalFormat = /^\d+(\.\d+)?$/.test(estimated_time); // Check for decimal format
      
                      if (isHHMMFormat) {
                          // If input is in HH:mm format, use as is for both display and saving
                          content1.estimated_hours = estimated_time;
                          flag = true;
                      } else if (isDecimalFormat) {
                          // If input is in decimal format, convert it to HH:mm for display and saving
                          let timeInHours = parseFloat(estimated_time); // Convert to float
                          let formattedTime = convertToHHMM(timeInHours); // Convert to HH:mm
                          content1.estimated_hours = formattedTime; // Save and display as HH:mm
                          flag = true;
                      } else {
                          // Invalid input
                          flag = false;
                      }
                  }
      
                  if (flag) {
                      // Update the displayed estimated time in HH:mm format (or empty if the input was empty)
                      currentRow.find("td.estimated_hours span.td_text").html(content1.estimated_hours || ""); // Display empty or formatted time
      
                      // Perform the AJAX request to save the data
                      $.ajax({
                          type: "PUT",
                          url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                              issue: content1,
                          }),
                          success: function (result, status, xhr) {
                              // Optionally reload or update the UI
                              // location.reload();
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
                          },
                      });
                  } else {
                      // Revert to the previous value if input is invalid
                      currentRow.find("td.estimated_hours span.td_text").html(get_estimated_time);
                      toastr["error"]("Estimated time is invalid.");
                  }
      
                  // Remove the input field
                  $(`#${tdId}`).remove();
                  $(`td#issue_estimated_hours_id-${issueId}`).css("display", "revert");
              }
          });
      }                    
        // ----------------Done Ratio ------------
        else if (clickedtd_split == "done_ratio") {
          percentDropdown(rowId, currentTdClass);
          $(`#${tdId}`).on("change", function () {
            var ratio_update = $("#percent_issue-" + issueId)
              .find("option:selected")
              .val();
            $(`#${tdId}`).remove();
            $(`td#issue_cf_done_ratio_id-${issueId}`).css("display", "revert");

            // var done_ratio = parseInt(ratio_update);
            // var todo_ratio = 100 - done_ratio;
            // currentRow.find('td.done_ratio .progress .closed').css('width', done_ratio + '%').attr('title', done_ratio + '%');
            // currentRow.find('td.done_ratio .progress .todo').css('width', todo_ratio + '%');
            // currentRow.find('td.done_ratio label').text(done_ratio + '%');
            // currentRow.find('td.done_ratio').css('display', 'revert');

            var content1 = {
              done_ratio: parseInt(ratio_update),
            };

            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                location.reload();
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
              },
            });
          });
        }
        // -----------------Subject ---------------
        else if (clickedtd_split == "subject") {
          var temp_this = this;
          var get_subject_text = currentRow.find("td.subject a").text();

          $(`tr#${rowId} td#${tdId}`).append(
            `<input id="dynamic-edit-${currentTdClass}" size="65px" maxlength="255"  title="Issue subject"
        placeholder="Enter subject..." type="text" ></input>`
          );
          let set_subject_text = document.getElementById(
            `dynamic-edit-${currentTdClass}`
          );

          set_subject_text.value = `${get_subject_text}`;

          $(`#${tdId}`).on("keypress", function (e) {
            if (e.which == 13) {
              var subject_text = $(`#dynamic-edit-${currentTdClass}`).val();

              if (subject_text.trim() !== "") {
                currentRow.find("td.subject a").html(subject_text);
              }
              $(`#${tdId}`).remove();
              $(`td#issue_subject_id-${issueId}`).css("display", "revert");

              var content1 = {
                subject: subject_text,
              };

              $.ajax({
                type: "PUT",
                url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                  issue: content1,
                }),
                // eslint-disable-next-line no-unused-vars
                success: function (result, status, xhr) {
                  // location.reload();
                  $(temp_this).closest("tr").addClass("hascontextmenu");
                },
                error: function (xhr, status, error) {
                  $(temp_this).closest("tr").addClass("hascontextmenu");
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
                  var response = JSON.parse(xhr.responseText);
                  toastr["error"](response.errors.join(", "));
                },
              });
            }
          });
        }
        //-------------Custom String Type-------------------
        else if (clickedtd === `cf_${custom_id} string`) {
          var temp_this = this;
          // var value = $("." + currentTdClass).text();
          $.ajax({
            type: "GET",
            url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status, xhr) {
              if (data.issue.hasOwnProperty("custom_fields")) {
                var c_f_issues_ids = data.issue.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id}`)
                      .text();
                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input size="65px" id="dynamic-edit-${currentTdClass}" maxlength="255" title="Issue custom field"
                placeholder="Enter custom field text..." type="text" >`
                    );
                    let set_cf_id_text = document.getElementById(
                      `dynamic-edit-${currentTdClass}`
                    );
                    set_cf_id_text.value = `${get_cf_id_text}`.trim();
                    var old_value=`${get_cf_id_text}`.trim();
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
                        $(`td#issue_cf_${custom_id}_id-${issueId}`).css(
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
                          url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                            issue: content1,
                          }),
                          success: function (result, status, xhr) {
                            // location.reload();
                            $(temp_this)
                              .closest("tr")
                              .addClass("hascontextmenu");
                          },
                          error: function (xhr, status, error) {
                            $(temp_this)
                              .closest("tr")
                              .addClass("hascontextmenu");
                            if (xhr.status == 422) {
                              let content = JSON.parse(xhr.responseText).errors;
                              console.log(currentRow.find(`td.cf_${custom_id} span.td_text`),'abcd',old_value)
                              currentRow.find(`td.cf_${custom_id} span.td_text`).html(old_value);
                              toastr["error"](content);
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
                    "This custom field is not belong to this issue"
                  );
                }
              } else {
                toastr["error"](
                  "This custom field is not belong to this project or tracker"
                );
              }
            },
            error: function (xhr, status, error) {
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });
        }
        //-------------Custom Long long-------------------
        else if (clickedtd === `cf_${custom_id} text`) {
          var temp_this = this;
          // var value = $("." + currentTdClass).text();
          $.ajax({
            type: "GET",
            url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status, xhr) {
              if (data.issue.hasOwnProperty("custom_fields")) {
                var c_f_issues_ids = data.issue.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id}`)
                      .text();

                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input size="15" id="dynamic-edit-${currentTdClass}" maxlength="255" title="Issue custom field"
                placeholder="Enter custom field text..." type="text" >`
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
                        // $(cf_value).append(get_cf_id_text);
                        $(`#${tdId}`).remove();
                        $(`td#issue_cf_${custom_id}_id-${issueId}`).css(
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
                          url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                            issue: content1,
                          }),
                          success: function (result, status, xhr) {
                            // location.reload();
                            $(temp_this)
                              .closest("tr")
                              .addClass("hascontextmenu");
                          },
                          error: function (xhr, status, error) {
                            if (xhr.status == 422) {
                              let content = JSON.parse(xhr.responseText).errors;

                              toastr["error"](content);
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
                    "This custom field is not belong to this issue"
                  );
                }
              } else {
                toastr["error"](
                  "This custom field is not belong to this project or tracker"
                );
              }
            },
            error: function (xhr, status, error) {
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });
        }

        //-------------Custom Integer Type-------------------
        else if (clickedtd === `cf_${custom_id} int`) {
          // var value = $("." + currentTdClass).text();
          var temp_this = this;
          $.ajax({
            type: "GET",
            url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status, xhr) {
              if (data.issue.hasOwnProperty("custom_fields")) {
                var c_f_issues_ids = data.issue.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id}`)
                      .text();

                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input size="6" id="dynamic-edit-${currentTdClass}" title="Issue custom field"
                placeholder="Enter only integer number..." type="number" >`
                    );
                    let set_cf_id_text = document.getElementById(
                      `dynamic-edit-${currentTdClass}`
                    );
                    if(`${get_cf_id_text}`.trim().length==0){
                      set_cf_id_text.value= `${get_cf_id_text}`;
                    }else{
                      set_cf_id_text.value= Number(`${get_cf_id_text}`);
                    }
                    var old_value=`${get_cf_id_text}`;
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
                        $(`td#issue_cf_${custom_id}_id-${issueId}`).css(
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
                          url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                            issue: content1,
                          }),
                          success: function (result, status, xhr) {
                            // location.reload();
                            $(temp_this)
                              .closest("tr")
                              .addClass("hascontextmenu");
                          },
                          error: function (xhr, status, error) {
                            if (xhr.status == 422) {
                              let content = JSON.parse(xhr.responseText).errors;
                              currentRow
                          .find(`td.cf_${custom_id} span.td_text`)
                          .html(old_value);
                              toastr["error"](content);
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
                    "This custom field is not belong to this issue"
                  );
                }
              } else {
                toastr["error"](
                  "This custom field is not belong to this project or tracker"
                );
              }
            },
            error: function (xhr, status, error) {
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });
        }
        //-------------Custom Date Type-------------------
        else if (clickedtd === `cf_${custom_id} date`) {
          // var value = $("." + currentTdClass).text();
          var temp_this = this;
          $.ajax({
            type: "GET",
            url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status, xhr) {
              if (data.issue.hasOwnProperty("custom_fields")) {
                var c_f_issues_ids = data.issue.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id}`)
                      .text()
                      .split("\n")[0];
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
                      // if (e.which == 13) {
                      var custom_field_array = [];
                      var cf_value = $(`#dynamic-edit-${currentTdClass}`).val();

                      // if(cf_value){
                      //   var dateParts = cf_value.split("-");
                      //   var changeDateFormate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
                      //   currentRow.find(`td.cf_${custom_id} span.td_text`).html(changeDateFormate);
                      //   }else{
                      //     currentRow.find(`td.cf_${custom_id} span.td_text`).html("");
                      //  }

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
                      $(`td#issue_cf_${custom_id}_id-${issueId}`).css(
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
                        url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify({
                          issue: content1,
                        }),
                        success: function (result, status, xhr) {
                          $(temp_this).closest("tr").addClass("hascontextmenu");
                          // location.reload();
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
                    "This custom field is not belong to this issue"
                  );
                }
              } else {
                toastr["error"](
                  "This custom field is not belong to this project or tracker"
                );
              }
            },
            error: function (xhr, status, error) {
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });
        }
        //-------------Custom List Type-------------------
        else if (clickedtd === `cf_${custom_id} list`) {
          var temp_this = this;
          getCustomData(rowId, currentTdClass, issueId, this);

          $(`#${tdId}`).on("change", function () {
            var custom_field_array = [];
            // var get_cf_id_text = currentRow.find(`td.cf_${custom_id}`).text();

            var select_cf_list;
            var select_cf_list_id;
            select_cf_list = $("#cf_list_issue-" + issueId)
              .find("option:selected")
              .html();
            select_cf_list_id = $("#cf_list_issue-" + issueId)
              .find("option:selected")
              .text();
            // cf_select_list_split = select_cf_list_id.split(" ")[0];

            currentRow
              .find(`td.cf_${custom_id} span.td_text`)
              .html(select_cf_list);
            // $(select_cf_list).append(get_cf_id_text);

            // $("select").css("display", "none");
            $(`#${tdId}`).remove();
            $(`td#issue_cf_${custom_id}_id-${issueId}`).css(
              "display",
              "revert"
            );

            //  ----------------- update values -------------------------

            custom_field_array.push({
              id: custom_id,
              value: `${select_cf_list_id}`,
            });

            var content1 = {
              custom_fields: custom_field_array,
            };

            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                $(temp_this).closest("tr").addClass("hascontextmenu");
                // location.reload();
              },
              error: function (xhr, status, error) {
                $(temp_this).closest("tr").addClass("hascontextmenu");
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
        //-------------Custom User Type-------------------
        else if (clickedtd == `cf_${custom_id} user`) {
          var temp_this = this;
          // var currentRow;
          $.ajax({
            type: "GET",
            url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status, xhr) {
              if (data.issue.hasOwnProperty("custom_fields")) {
                var c_f_issues_ids = data.issue.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    appendAssignee(rowId, currentTdClass, issueId,temp_this,customFieldId);
                    var currentTdClass;

                    var assigned_to_update;
                    var get_cf_id_text = currentRow.find(`td.cf_${custom_id} span.td_text`).text();
                    $(`#${tdId}`).on("change", function () {
                      var custom_field_array = [];
                      
                      var select_cf_user;
                      var select_cf_user_id;
                      select_cf_user = $("#assignee_to_issue-" + issueId)
                        .find("option:selected")
                        .html();
                      select_cf_user_id = $("#assignee_to_issue-" + issueId)
                        .find("option:selected")
                        .val();

                      // currentRow
                      //   .find(`td.cf_${custom_id} span.td_text`)
                      //   .html(select_cf_user);

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
                            .attr("style", "margin-top: -2px; display:none");
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
                      $(`td#issue_cf_${custom_id}_id-${issueId}`).css(
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
                        url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify({
                          issue: content1,
                        }),
                        success: function (result, status, xhr) {
                          // location.reload();
                          $(temp_this).closest("tr").addClass("hascontextmenu");
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
                    "This custom field is not belong to this issue"
                  );
                }
              } else {
                toastr["error"](
                  "This custom field is not belong to this project or tracker"
                );
              }
            },
            error: function (xhr, status, error) {
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });
        } //-------------Custom Float Type-------------------
        else if (clickedtd === `cf_${custom_id} float`) {
          var temp_this = this;
          // var value = $("." + currentTdClass).text();

          $.ajax({
            type: "GET",
            url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status, xhr, textStatus, jqXHR) {
              if (data.issue.hasOwnProperty("custom_fields")) {
                var issueee = data.issue.custom_fields;
                // console.log(issueee,"issue_cf_id");
                for (var i = 0; i < issueee.length; i++) {
                  var customFieldId = issueee[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id}`)
                      .text();
                    var old_value = get_cf_id_text.trim() !== '' ? parseFloat(get_cf_id_text.trim()) : '';
                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input size="6" id="dynamic-edit-${currentTdClass}" title="Issue custom field"
                    placeholder="Enter only decimal number..." type="number" step="0.01">`
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
                        // $(cf_value).append(get_cf_id_text);
                        $(`#${tdId}`).remove();
                        $(`td#issue_cf_${custom_id}_id-${issueId}`).css(
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
                          url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                            issue: content1,
                          }),
                          success: function (data, status, xhr) {
                            // console.log(xhr.status);
                            $(temp_this)
                              .closest("tr")
                              .addClass("hascontextmenu");
                          },
                          error: function (xhr, status, error) {
                            currentRow
                              .find(`td.cf_${custom_id} span.td_text`)
                              .html(old_value);
                            if (xhr.status == 422) {
                              let content = JSON.parse(xhr.responseText).errors;
                              toastr["error"](content);
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
                    "This custom field is not belong to this issue."
                  );
                }
              } else {
                toastr["error"](
                  "This custom field is not belong to this project or tracker."
                );
              }
            },
            error: function (xhr, jqXHR, status, error) {
              // console.log(jqXHR, "status");
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });
        }
        //-------------Custom Link Type-------------------
        else if (clickedtd === `cf_${custom_id} link`) {
          var temp_this = this;
          // var value = $("." + currentTdClass).text();

          $.ajax({
            type: "GET",
            url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status, xhr) {
              if (data.issue.hasOwnProperty("custom_fields")) {
                var c_f_issues_ids = data.issue.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    var get_cf_id_text = currentRow
                      .find(`td.cf_${custom_id} a`)
                      .text();

                    $(`tr#${rowId} td#${tdId}`).append(
                      `<input size="15" id="dynamic-edit-${currentTdClass}" title="Issue custom field"
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
                        var anchorElement = currentRow.find(`td.cf_${custom_id} a`);
                        if (anchorElement.length === 0) {
                            var tdElement=currentRow.find(`td.cf_${custom_id} .edit-issue`)
                            var anchorElement = $('<a>', {
                              href: `http://${cf_value}`,
                              text: `${cf_value}`,
                              class: 'external'
                            });
                            tdElement.before(anchorElement);
                          }else{
                            anchorElement.attr('href', `http://${cf_value}`);
                            anchorElement.text(`${cf_value}`);
                          }
                        // $(cf_value).append(get_cf_id_text);
                        $(`#${tdId}`).remove();
                        $(`td#issue_cf_${custom_id}_id-${issueId}`).css(
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
                          url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
                          dataType: "json",
                          contentType: "application/json",
                          data: JSON.stringify({
                            issue: content1,
                          }),
                          success: function (result, status, xhr) {
                            // location.reload();
                            $(temp_this)
                              .closest("tr")
                              .addClass("hascontextmenu");
                          },
                          error: function (xhr, status, error) {
                            $(temp_this)
                              .closest("tr")
                              .addClass("hascontextmenu");
                            if (xhr.status == 422) {
                              let content = JSON.parse(xhr.responseText).errors;

                              toastr["error"](content);
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
                    "This custom field is not belong to this issue."
                  );
                }
              } else {
                toastr["error"](
                  "This custom field is not belong to this project or tracker."
                );
              }
            },
            error: function (xhr, status, error) {
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });
        }

        //-------------Custom List Type-------------------
        else if (clickedtd === `cf_${custom_id} bool`) {
          var temp_this = this;
          getCustomData(rowId, currentTdClass, issueId, this);
          $(`#${tdId}`).on("change", function () {
            var custom_field_array = [];
            // var get_cf_id_text = currentRow.find(`td.cf_${custom_id}`).text();

            var select_cf_list;
            var select_cf_list_id;
            select_cf_list = $("#cf_bool_issue-" + issueId)
              .find("option:selected")
              .html();
            select_cf_list_id = $("#cf_bool_issue-" + issueId)
              .find("option:selected")
              .val();

            currentRow
              .find(`td.cf_${custom_id} span.td_text`)
              .html(select_cf_list);
            // $(select_cf_list).append(get_cf_id_text);

            // $("select").css("display", "none");
            $(`#${tdId}`).remove();
            $(`td#issue_cf_${custom_id}_id-${issueId}`).css(
              "display",
              "revert"
            );

            //  ----------------- update values -------------------------

            custom_field_array.push({
              id: custom_id,
              value: `${select_cf_list_id}`,
            });

            var content1 = {
              custom_fields: custom_field_array,
            };

            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                $(temp_this).closest("tr").addClass("hascontextmenu");
                // location.reload();
              },
              error: function (xhr, status, error) {
                $(temp_this).closest("tr").addClass("hascontextmenu");
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
        // ----------------Start Date and Due Date------------------
        else if (clickedtd_split == "start_date") {
          var get_start_date = currentRow
            .find("td.start_date")
            .text()
            .split("\n")[0];

          var changeDateeee = changeFormat(
            get_start_date,
            selected_date_format
          );

          $(`tr#${rowId} td#${tdId}`).append(
            `<input id="dynamic-edit-${currentTdClass}" type="date">`
          );

          let set_start_date = document.getElementById(
            `dynamic-edit-${currentTdClass}`
          );

          set_start_date.value = changeDateeee;

          $(`#${tdId}`).on("change", function (e) {
            var updating_date = $(`#dynamic-edit-${currentTdClass}`).val();

            if (selected_date_format === "YYYY-MM-DD") {
              if (updating_date) {
                var dateParts = updating_date.split("-");
                var changeDateFormat = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;

                var startDateSpan = currentRow.find(
                  "td.start_date span.td_text"
                );

                if (startDateSpan.length > 0) {
                  startDateSpan.html(changeDateFormat);
                  if (startDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                }
              } else {
                currentRow.find("td.start_date span.td_text").html("");
                currentRow
                  .find("td.start_date span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              }
            } else if (selected_date_format === "DD/MM/YYYY") {
              if (updating_date) {
                var dateParts = updating_date.split("-");
                var changeDateFormat = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

                var startDateSpan = currentRow.find(
                  "td.start_date span.td_text"
                );

                if (startDateSpan.length > 0) {
                  startDateSpan.html(changeDateFormat);
                  if (startDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                }
              } else {
                currentRow.find("td.start_date span.td_text").html("");
                currentRow
                  .find("td.start_date span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              }
            } else if (selected_date_format === "MM/DD/YYYY") {
              if (updating_date) {
                var dateParts = updating_date.split("-");
                var changeDateFormat = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;

                var startDateSpan = currentRow.find(
                  "td.start_date span.td_text"
                );

                if (startDateSpan.length > 0) {
                  startDateSpan.html(changeDateFormat);
                  if (startDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                }
              } else {
                currentRow.find("td.start_date span.td_text").html("");
                currentRow
                  .find("td.start_date span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              }
            } else if (selected_date_format === "DD-MM-YYYY") {
              if (updating_date) {
                var dateParts = updating_date.split("-");
                var changeDateFormat = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

                var startDateSpan = currentRow.find(
                  "td.start_date span.td_text"
                );

                if (startDateSpan.length > 0) {
                  startDateSpan.html(changeDateFormat);
                  if (startDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                }
              } else {
                currentRow.find("td.start_date span.td_text").html("");
                currentRow
                  .find("td.start_date span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              }
            } else if (selected_date_format === "MM/DD/YYYY") {
              if (updating_date) {
                var dateParts = updating_date.split("-");
                var changeDateFormat = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;

                var startDateSpan = currentRow.find(
                  "td.start_date span.td_text"
                );

                if (startDateSpan.length > 0) {
                  startDateSpan.html(changeDateFormat);
                  if (startDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                }
              } else {
                currentRow.find("td.start_date span.td_text").html("");
                currentRow
                  .find("td.start_date span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              }
            } else if (selected_date_format === "DD %b YYYY") {
              if (updating_date) {
                var dateObj = new Date(updating_date);
                var day = dateObj.getDate();
                var month = dateObj.toLocaleString("en-us", { month: "short" });
                var year = dateObj.getFullYear();
                var changeDateFormat = `${day} ${month} ${year}`;

                var startDateSpan = currentRow.find(
                  "td.start_date span.td_text"
                );

                if (startDateSpan.length > 0) {
                  startDateSpan.html(changeDateFormat);
                  if (startDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                }
              } else {
                currentRow.find("td.start_date span.td_text").html("");
                currentRow
                  .find("td.start_date span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              }
            } else if (selected_date_format === "DD %B YYYY") {
              if (updating_date) {
                var dateObj = new Date(updating_date);
                var day = dateObj.getDate();
                var month = dateObj.toLocaleString("en-us", { month: "long" });
                var year = dateObj.getFullYear();
                var changeDateFormat = `${day} ${month} ${year}`;

                var startDateSpan = currentRow.find(
                  "td.start_date span.td_text"
                );

                if (startDateSpan.length > 0) {
                  startDateSpan.html(changeDateFormat);
                  if (startDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                }
              } else {
                currentRow.find("td.start_date span.td_text").html("");
                currentRow
                  .find("td.start_date span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              }
            } else if (selected_date_format === "%b DD, YYYY") {
              if (updating_date) {
                var dateObj = new Date(updating_date);
                var options = {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                };
                var changeDateFormat = dateObj.toLocaleDateString(
                  "en-US",
                  options
                );

                var startDateSpan = currentRow.find(
                  "td.start_date span.td_text"
                );

                if (startDateSpan.length > 0) {
                  startDateSpan.html(changeDateFormat);
                  if (startDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                }
              } else {
                currentRow.find("td.start_date span.td_text").html("");
                currentRow
                  .find("td.start_date span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              }
            } else if (selected_date_format === "%B DD, YYYY") {
              if (updating_date) {
                var dateObj = new Date(updating_date);
                var options = {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                };
                var changeDateFormat = dateObj.toLocaleDateString(
                  "en-US",
                  options
                );

                var startDateSpan = currentRow.find(
                  "td.start_date span.td_text"
                );

                if (startDateSpan.length > 0) {
                  startDateSpan.html(changeDateFormat);
                  if (startDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                }
              } else {
                currentRow.find("td.start_date span.td_text").html("");
                currentRow
                  .find("td.start_date span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              }
            } else if (selected_date_format === "DD.MM.YYYY") {
              if (updating_date) {
                var dateParts = updating_date.split("-");
                var changeDateFormat = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

                var startDateSpan = currentRow.find(
                  "td.start_date span.td_text"
                );

                if (startDateSpan.length > 0) {
                  startDateSpan.html(changeDateFormat);
                  if (startDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.start_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                }
              } else {
                currentRow.find("td.start_date span.td_text").html("");
                currentRow
                  .find("td.start_date span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              }
            }

            $(`#${tdId}`).remove();
            $(`td#issue_start_date_id-${issueId}`).css("display", "revert");

            var content1 = {
              start_date: updating_date,
            };

            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                // location.reload();
              },
              error: function (xhr, status, error) {
                if (xhr.status == 422) {
                  let content = JSON.parse(xhr.responseText).errors;

                  toastr["error"](content);
                }
              },
            });
          });
        } else if (clickedtd_split == "due_date") {
          var get_due_date = currentRow
            .find("td.due_date")
            .text()
            .split("\n")[0];
          var change_dueDate = changeFormat(get_due_date, selected_date_format);

          $(`tr#${rowId} td#${tdId}`).append(
            `<input id="dynamic-edit-${currentTdClass}" type="date" >`
          );
          let set_due_date = document.getElementById(
            `dynamic-edit-${currentTdClass}`
          );

          set_due_date.value = `${change_dueDate}`;

          $(`#${tdId}`).on("change", function (e) {
            var updating_due_date = $(`#dynamic-edit-${currentTdClass}`).val();

            if (selected_date_format === "YYYY-MM-DD") {
              if (updating_due_date) {
                var dateParts = updating_due_date.split("-");
                var changeDateFormat = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
                currentRow
                  .find("td.due_date span.td_text")
                  .html(changeDateFormat);
              } else {
                currentRow.find("td.due_date span.td_text").html("");
              }
            } else if (selected_date_format === "DD/MM/YYYY") {
              if (updating_due_date) {
                var dateParts = updating_due_date.split("-");
                var changeDateFormat = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                var dueDateSpan = currentRow.find("td.due_date span.td_text");

                if (dueDateSpan.length > 0) {
                  dueDateSpan.html(changeDateFormat);
                  if (dueDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                } else {
                  currentRow.find("td.due_date span.td_text").html("");
                  currentRow
                    .find("td.due_date span.edit-issue")
                    .attr("style", "margin-top: -7px; display:none");
                }
              }
            } else if (selected_date_format === "MM/DD/YYYY") {
              if (updating_due_date) {
                var dateParts = updating_due_date.split("-");
                var changeDateFormat = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
                var dueDateSpan = currentRow.find("td.due_date span.td_text");

                if (dueDateSpan.length > 0) {
                  dueDateSpan.html(changeDateFormat);
                  if (dueDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                } else {
                  currentRow.find("td.due_date span.td_text").html("");
                  currentRow
                    .find("td.due_date span.edit-issue")
                    .attr("style", "margin-top: -7px; display:none");
                }
              }
            } else if (selected_date_format === "DD-MM-YYYY") {
              if (updating_due_date) {
                var dateParts = updating_due_date.split("-");
                var changeDateFormat = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                var dueDateSpan = currentRow.find("td.due_date span.td_text");

                if (dueDateSpan.length > 0) {
                  dueDateSpan.html(changeDateFormat);
                  if (dueDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                } else {
                  currentRow.find("td.due_date span.td_text").html("");
                  currentRow
                    .find("td.due_date span.edit-issue")
                    .attr("style", "margin-top: -7px; display:none");
                }
              }
            } else if (selected_date_format === "MM/DD/YYYY") {
              if (updating_due_date) {
                var dateParts = updating_due_date.split("-");
                var changeDateFormat = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
                var dueDateSpan = currentRow.find("td.due_date span.td_text");

                if (dueDateSpan.length > 0) {
                  dueDateSpan.html(changeDateFormat);
                  if (dueDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                } else {
                  currentRow.find("td.due_date span.td_text").html("");
                  currentRow
                    .find("td.due_date span.edit-issue")
                    .attr("style", "margin-top: -7px; display:none");
                }
              }
            } else if (selected_date_format === "DD %b YYYY") {
              if (updating_due_date) {
                var dateObj = new Date(updating_due_date);
                var day = dateObj.getDate();
                var month = dateObj.toLocaleString("en-us", { month: "short" });
                var year = dateObj.getFullYear();
                var changeDateFormat = `${day} ${month} ${year}`;
                var dueDateSpan = currentRow.find("td.due_date span.td_text");

                if (dueDateSpan.length > 0) {
                  dueDateSpan.html(changeDateFormat);
                  if (dueDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                } else {
                  currentRow.find("td.due_date span.td_text").html("");
                  currentRow
                    .find("td.due_date span.edit-issue")
                    .attr("style", "margin-top: -7px; display:none");
                }
              }
            } else if (selected_date_format === "DD %B YYYY") {
              if (updating_due_date) {
                var dateObj = new Date(updating_due_date);
                var day = dateObj.getDate();
                var month = dateObj.toLocaleString("en-us", { month: "long" });
                var year = dateObj.getFullYear();
                var changeDateFormat = `${day} ${month} ${year}`;
                var dueDateSpan = currentRow.find("td.due_date span.td_text");

                if (dueDateSpan.length > 0) {
                  dueDateSpan.html(changeDateFormat);
                  if (dueDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                } else {
                  currentRow.find("td.due_date span.td_text").html("");
                  currentRow
                    .find("td.due_date span.edit-issue")
                    .attr("style", "margin-top: -7px; display:none");
                }
              }
            } else if (selected_date_format === "%b DD, YYYY") {
              if (updating_due_date) {
                var dateObj = new Date(updating_due_date);
                var options = {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                };
                var changeDateFormat = dateObj.toLocaleDateString(
                  "en-US",
                  options
                );
                var dueDateSpan = currentRow.find("td.due_date span.td_text");

                if (dueDateSpan.length > 0) {
                  dueDateSpan.html(changeDateFormat);
                  if (dueDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                } else {
                  currentRow.find("td.due_date span.td_text").html("");
                  currentRow
                    .find("td.due_date span.edit-issue")
                    .attr("style", "margin-top: -7px; display:none");
                }
              }
            } else if (selected_date_format === "%B DD, YYYY") {
              if (updating_due_date) {
                var dateObj = new Date(updating_due_date);
                var options = {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                };
                var changeDateFormat = dateObj.toLocaleDateString(
                  "en-US",
                  options
                );
                var dueDateSpan = currentRow.find("td.due_date span.td_text");

                if (dueDateSpan.length > 0) {
                  dueDateSpan.html(changeDateFormat);
                  if (dueDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                } else {
                  currentRow.find("td.due_date span.td_text").html("");
                  currentRow
                    .find("td.due_date span.edit-issue")
                    .attr("style", "margin-top: -7px; display:none");
                }
              }
            } else if (selected_date_format === "DD.MM.YYYY") {
              if (updating_due_date) {
                var dateParts = updating_due_date.split("-");
                var changeDateFormat = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
                var dueDateSpan = currentRow.find("td.due_date span.td_text");

                if (dueDateSpan.length > 0) {
                  dueDateSpan.html(changeDateFormat);
                  if (dueDateSpan.text().trim() === "") {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: -7px; display:none");
                  } else {
                    currentRow
                      .find("td.due_date span.edit-issue")
                      .attr("style", "margin-top: 0px; display:none");
                  }
                } else {
                  currentRow.find("td.due_date span.td_text").html("");
                  currentRow
                    .find("td.due_date span.edit-issue")
                    .attr("style", "margin-top: -7px; display:none");
                }
              }
            }

            $(`#${tdId}`).remove();
            $(`td#issue_due_date_id-${issueId}`).css("display", "revert");

            var content1 = {
              due_date: updating_due_date,
            };

            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                // location.reload();
              },
              error: function (xhr, status, error) {
                if (xhr.status == 422) {
                  let content = JSON.parse(xhr.responseText).errors;

                  toastr["error"](content);
                }
              },
            });
          });
        }
        // -----------------Category--------------------------
        else if (clickedtd == "category") {
          categorieDropdown(rowId, currentTdClass, projectId, issueId);
          var currentTdClass;
          // var currentRow;
          $(`#${tdId}`).on("change", function () {
            var select_version;
            var select_version_id;
            select_version = $("#categorie_issue-" + issueId)
              .find("option:selected")
              .html();
            select_version_id = $("#categorie_issue-" + issueId)
              .find("option:selected")
              .val();

            var categorySpan = currentRow.find("td.category span.td_text");

            if (categorySpan.length > 0) {
              categorySpan.html(select_version);
              if (categorySpan.text().trim() === "") {
                currentRow
                  .find("td.category span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              } else {
                currentRow
                  .find("td.category span.edit-issue")
                  .attr("style", "margin-top: 0px; display:none");
              }
            }

            $(`#${tdId}`).remove();
            $(`td#issue_category_id-${issueId}`).css("display", "revert");

            var content1 = {
              category_id: select_version_id,
            };

            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                // location.reload();
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
              },
            });
          });
        }
        //------------------- issue versions --------------------
        else if (clickedtd_split == "fixed_version") {
          var temp_this = this;
          versionDropdown(rowId, currentTdClass, projectId, issueId, this);
          var currentTdClass;
          // var currentRow;
          $(`#${tdId}`).on("change", function () {
            var select_version;
            var select_version_id;
            select_version = $("#version_issue-" + issueId)
              .find("option:selected")
              .attr("title");
            select_version_id = $("#version_issue-" + issueId)
              .find("option:selected")
              .val();
            var fixedVersionLink = currentRow.find("td.fixed_version a");
            if (fixedVersionLink.length > 0) {
              fixedVersionLink.html(select_version !== undefined ? select_version : "");
              currentRow.find("td.fixed_version").prepend(anchorTag);
              if (fixedVersionLink.text().trim() === "") {
                currentRow
                  .find("td.fixed_version span.edit-issue")
                  .attr("style", "margin-top: -7px; display:none");
              } else {
                currentRow
                  .find("td.fixed_version span.edit-issue")
                  .attr("style", "margin-top: -2px; display:none");
              }
            } else {
              var anchorTag = `<a href="#" >${select_version}</a>`;
              currentRow.find("td.fixed_version").prepend(anchorTag);
              currentRow
                .find("td.fixed_version span.edit-issue")
                .attr("style", "margin-top: -2px; display:none");
            }
            // $("select").css("display", "none");
            $(`#${tdId}`).remove();
            $(`td#issue_fixed_version_id-${issueId}`).css("display", "revert");

            var content1 = {
              fixed_version_id: select_version_id,
            };
            $.ajax({
              type: "PUT",
              url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                issue: content1,
              }),
              success: function (result, status, xhr) {
                // location.reload();
                $(temp_this).closest("tr").addClass("hascontextmenu");
              },
              error: function (xhr, status, error) {
                $(temp_this).closest("tr").addClass("hascontextmenu");
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
        //------------------- issue custom versions --------------------
        else if (clickedtd == `cf_${custom_id} version`) {
          var temp_this = this;
          $.ajax({
            type: "GET",
            url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status, xhr) {
              if (data.issue.hasOwnProperty("custom_fields")) {
                var c_f_issues_ids = data.issue.custom_fields;
                for (var i = 0; i < c_f_issues_ids.length; i++) {
                  var customFieldId = c_f_issues_ids[i].id;
                  if (customFieldId == custom_id) {
                    cs_falid = false;
                    versionDropdown(rowId, currentTdClass, projectId, issueId);
                    var currentTdClass;
                    // var currentRow;
                    $(`#${tdId}`).on("change", function () {
                      var custom_field_array = [];

                      var select_cf_version;
                      var select_cf_version_id;
                      select_cf_version = $("#version_issue-" + issueId)
                        .find("option:selected")
                        .attr("title");

                      // console.log(select_cf_version, "selected_version");
                      select_cf_version_id = $("#version_issue-" + issueId)
                        .find("option:selected")
                        .val();

                      currentRow
                        .find(`td.cf_${custom_id} span.td_text`)
                        .html(select_cf_version);

                      $(`#${tdId}`).remove();
                      $(`td#issue_cf_${custom_id}_id-${issueId}`).css(
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
                        url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify({
                          issue: content1,
                        }),
                        success: function (result, status, xhr) {
                          // location.reload();
                          $(temp_this).closest("tr").addClass("hascontextmenu");
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
                    "This custom field is not belong to this issue"
                  );
                }
              } else {
                toastr["error"](
                  "This custom field is not belong to this project or tracker"
                );
              }
            },
            error: function (xhr, status, error) {},
          });
        }
      });
      $("td.description.block_column").each(function () {
        if ($(this).find("div.wiki").length > 0) {
          $(this).find("span.edit-issue").remove();
        }
      });
    });

    var url = window.location.origin;

    function appendProjectDropdown(
      rowId,
      currentTdClass,
      projectId,
      selectedProject,
      temp_this
    ) {
      $.ajax({
        url: `${url}/all_projects.json?key=${issue_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (data) {
          var rowtext = $(`tr#${rowId}`).find("td.project a").text();
          var issue_project = rowtext.split("\n")[0];
          projects = data.projects;
          var projectDropdown = "<select id= project_" + rowId + ">";
          for (let i = 0; i < projects.length; i++) {
            var projectName = projects[i].name;
            var display_name = projectName;

            if (projectName.length > 20) {
              display_name = projectName.substring(0, 15) + "...";
            }

            projectDropdown +=
              `<option ${
                issue_project == projectName ? "selected" : ""
              } value = ${projects[i].id} title="${projectName}">` +
              display_name +
              "</option>";
          }

          $(`tr#${rowId} td#${tdId}`).append(projectDropdown);
          // $(`#project_${rowId}`).prepend('<option value="  "></option>');
        },
        error: function () {
          $(temp_this).closest("tr").addClass("hascontextmenu");
        },
      });
    }

    function priorityDropdown(rowId, currentTdClass, selectedPriority) {
      $.ajax({
        url: `${url}/enumerations/issue_priorities.json?key=${issue_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (data) {
          var rowtext = $(`tr#${rowId}`).find("td.priority").text();
          var issue_priority = rowtext.split("\n")[0];

          priorities = data.issue_priorities;

          var priorityDropdown = "<select id= priority_" + rowId + ">";
          for (let i = 0; i < priorities.length; i++) {
            priorityDropdown +=
              `<option ${
                issue_priority == priorities[i].name ? "selected" : ""
              } value = ${priorities[i].id}>` +
              priorities[i].name +
              "</option>";
          }
          $(`tr#${rowId} td#${tdId}`).append(priorityDropdown);
        },
        error: function () {},
      });
    }

    function appendAssignee(rowId, currentTdClass, issueId, temp_this,customId) {
      var project_id;
      $.ajax({
        url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        data: { limit: 200 },
        success: function (data) {
          var issues_data = data.issue;
          project_id = issues_data.project.id;

          $.ajax({
            url: `${url}/projects/${project_id}/active_memberss.json?key=${issue_api_key}`,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (data) {
              var rowtext;
              var issue_assignee;
              if (typeof currentTdClass === 'undefined') {
                rowtext =  $(`#issue_cf_${customId}_id-${issueId}`).find("span.td_text").text();
                issue_assignee = rowtext;
              } else {
                rowtext = $(`tr#${rowId}`).find("td.assigned_to a").text();
                issue_assignee = rowtext.split("\n")[0];
              }
              var members = data.active_members;

              var memberDropdown = "<select id= assignee_to_" + rowId + ">";

              // If issue_assignee is empty, set the empty option as selected
              if (issue_assignee.trim() === "") {
                memberDropdown += `<option value="" selected></option>`;
              } else {
                memberDropdown += `<option value=""></option>`;
              }

              for (var i = 0; i < members.length; i++) {
                var member_id = members[i].id;
                var member_name = members[i].name;

                memberDropdown +=
                  `<option ${
                    issue_assignee == member_name ? "selected" : ""
                  } value = ${member_id}>` +
                  member_name +
                  "</option>";
              }

              $(`tr#${rowId} td#${tdId}`).append(memberDropdown);
              if ($(`select#assignee_to_${rowId} option`).length == 1) {
                toastr["error"]("This project does not have a assignee");
                $(`#assignee_to_${rowId}`).css("display", "none");
              }
            },
            error: function () {
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });
        },
        error: function () {
          $(temp_this).closest("tr").addClass("hascontextmenu");
        },
      });
    }
    // ---------------------- Tracker api ----------------

    function trackerDropdown(
      rowId,
      currentTdClass,
      projectId,
      issueId,
      temp_this
    ) {
      var tracker_id;

      $.ajax({
        url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (data) {
          var issues_data = data.issue;
          tracker_id = issues_data.project.id;
          var api_key = "b114b9aeb870cc49e901aaf223ea422fcbd669f8";
          var id = projectId;

          $.ajax({
            url: `${url}/projects/${tracker_id}.json?key=${issue_api_key}&&include=trackers`,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (data) {
              var project = data;

              var trackers = data.project.trackers;
              var rowtext = $(`tr#${rowId}`).find("td.tracker").text();
              var issue_tracker = rowtext.split("\n")[0];

              var trackerDropdown = "<select id= tracker_" + rowId + ">";
              for (let i = 0; i < trackers.length; i++) {
                trackerDropdown +=
                  `<option ${
                    issue_tracker == trackers[i].name ? "selected" : ""
                  } value = ${trackers[i].id}>` +
                  trackers[i].name +
                  "</option>";
              }

              $(`tr#${rowId} td#${tdId}`).append(trackerDropdown);
            },
            error: function () {
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });
        },
        error: function () {
          $(temp_this).closest("tr").addClass("hascontextmenu");
        },
      });
    }

    // ----------------- version api --------------

    function versionDropdown(
      rowId,
      currentTdClass,
      projectId,
      issueId,
      temp_this
    ) {
      var version_id;
      $.ajax({
        url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        data: { limit: 100 },
        success: function (data) {
          var issues_data = data.issue;
          version_id = issues_data.project.id;
          const currentUrl=window.location.href;
          const sendData = currentUrl.includes('projects') ? 'yes' : 'no';
          var id = projectId;
          $.ajax({
            url: `${url}/${version_id}/all_versions.json?key=${issue_api_key}`,
            type: "GET",
            crossDomain: true,
            data: {
              indata: sendData
          },
            dataType: "json",
            success: function (data) {
              var rowtext = $(`tr#${rowId}`).find("td.fixed_version a").text();
              // var issue_version_parts = rowtext.trim().split(" - ");
              // var issue_version = issue_version_parts.length > 1 ? issue_version_parts[issue_version_parts.length-1] : issue_version_parts[0];
              var issue_version=rowtext;
              var versions = data.version;
              var versionDropdown = `<select id="version_${rowId}">`;
              if (issue_version === "") {
                versionDropdown += `<option value="" selected></option>`;
              } else {
                versionDropdown += `<option value=""></option>`;
              }
          
              for (let i = 0; i < versions.length; i++) {
                var versionName = versions[i].name;
                var display_name = versionName;
                if (versionName.length > 20) {
                  display_name = versionName.substring(0, 20) + "...";
                }
          
                versionDropdown += `
                  <option ${issue_version == versionName ? "selected" : ""} 
                          value="${versions[i].id}" 
                          title="${versionName}">
                    ${display_name}
                  </option>`;
              }
              versionDropdown += `</select>`;
              $(`tr#${rowId} td#${tdId}`).append(versionDropdown);
          
              if ($(`select#version_${rowId} option`).length == 1) {
                toastr["error"]("This project does not have a fixed version.");
                $(`#version_${rowId}`).css("display", "none");
              }
            },
            error: function () {
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });          
        },
        error: function () {
          $(temp_this).closest("tr").addClass("hascontextmenu");
        },
      });
    }
    // ----------------- categories --------------

    function categorieDropdown(
      rowId,
      currentTdClass,
      projectId,
      issueId,
      temp_this
    ) {
      var categorie_id;
      $.ajax({
        url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
          var issues_data = data.issue;
          categorie_id = issues_data.project.id;

          var id = projectId;

          $.ajax({
            url: `${url}/projects/${categorie_id}/issue_categories.json?key=${issue_api_key}`,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (data) {
              var rowtext = $(`tr#${rowId}`).find("td.category").text();
              var issue_categories = rowtext.split("\n")[0];

              var categories = data.issue_categories;

              var categorieDropdown = "<select id= categorie_" + rowId + ">";
              categorieDropdown += "<option value=''></option>";
              for (let i = 0; i < categories.length; i++) {
                categorieDropdown +=
                  `<option ${
                    issue_categories == categories[i].name ? "selected" : ""
                  } value = ${categories[i].id}>` +
                  categories[i].name +
                  "</option>";
              }
              $(`tr#${rowId} td#${tdId}`).append(categorieDropdown);
              if ($(`select#categorie_${rowId} option`).length == 0) {
                toastr["error"]("This project does not have a category.");
                $(`#categorie_${rowId}`).css("display", "none");
              }
            },
            error: function () {
              $(temp_this).closest("tr").addClass("hascontextmenu");
            },
          });
        },
        error: function () {
          $(temp_this).closest("tr").addClass("hascontextmenu");
        },
      });
    }

    function percentDropdown(rowId, currentTdClass) {
      var percent_data = [
        "0",
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ];
      var currentPercentage = $(`tr#${rowId} td#${currentTdClass} label`)
        .text()
        .replace("%", "");
      console.log(currentPercentage, "currentPercentage");

      var percentDropdown = $("<select>", { id: "percent_" + rowId });

      for (let i = 0; i < percent_data.length; i++) {
        var option = $("<option>", {
          value: percent_data[i],
          text: percent_data[i] + "%",
        });

        if (percent_data[i] == currentPercentage) {
          option.attr("selected", "selected");
        }

        percentDropdown.append(option);
      }
      $(`tr#${rowId} td#${tdId}`).append(percentDropdown);
    }
    function getCustomData(rowId, currentTdClass, issueId, temp_this) {
      var cf_valid = false;
      $.ajax({
        url: `${url}/issues/${issueId}.json?key=${issue_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (data) {
          var issues_data = data.issue;
          if (data.issue.hasOwnProperty("custom_fields")) {
            var c_f_issue = issues_data.custom_fields;

            var project_tracker = issues_data.tracker.id;

            $.ajax({
              type: "GET",
              url: url + "/custom_fields.json?key=" + issue_api_key + " ",
              dataType: "json",
              async: false,
              success: function (result, index, xhr) {
                var rowtext = $(`tr#${rowId}`)
                  .find(`td.cf_${custom_id}`)
                  .text();
                var issue_cf = rowtext.split("\n")[0];
                var custom_cf_Dropdown;
                var custom_cf_Dropdown_bool;
                result.custom_fields.forEach((data, index) => {
                  if (data.customized_type === "issue") {
                    if (data.id == custom_id) {
                      if (data.field_format == "list") {
                        var cf_list = data.possible_values;
                        for (let i = 0; i < c_f_issue.length; i++) {
                          var cf_issue_ids = c_f_issue[i].id;
                          //  console.log(cf_issue_ids, "issue cf ids");
                          if (cf_issue_ids == custom_id) {
                            cf_valid = false;
                            custom_cf_Dropdown =
                              "<select id= cf_list_" + rowId + ">";
                            console.log(custom_cf_Dropdown,'helloworld')
                            for (let i = 0; i < cf_list.length; i++) {
                              custom_cf_Dropdown +=
                                `<option ${
                                  issue_cf == cf_list[i].label ? "selected" : ""
                                } value = ${cf_list[i].value}>` +
                                cf_list[i].label +
                                "</option>";
                            }
                            break;
                          } else {
                            //  toastr["error"]('custom field tracker is not belongs to project tracker');
                            cf_valid = true;
                          }
                        }
                        if (cf_valid == true) {
                          toastr["error"](
                            "This custom field is not belong to this issue"
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
                            custom_cf_Dropdown += `<option value="" selected></option>`;
                            for (let i = 0; i < cf_bool.length; i++) {
                              custom_cf_Dropdown +=
                                `<option ${
                                  issue_cf == cf_bool[i].label ? "selected" : ""
                                } value = ${cf_bool[i].value}>` +
                                cf_bool[i].label +
                                "</option>";
                            }
                            break;
                          } else {
                            cf_valid = true;
                          }
                        }
                        if (cf_valid == true) {
                          toastr["error"](
                            "This custom field is not belong to this issue"
                          );
                        }
                      }
                    }
                  }
                });
                $(`tr#${rowId} td#${tdId}`).append(custom_cf_Dropdown);
              },
            });
          } else {
            toastr["error"](
              "This custom field is not belong to this project or tracker"
            );
          }
        },
        error: function () {
          $(temp_this).closest("tr").addClass("hascontextmenu");
        },
      });
    }
    function statusDropdown(rowId, currentTdClass, projectId, issueId, tdId) {
      var status_id;
      $.ajax({
        url: `${url}/issues/${issueId}/allowed_status?key=${issue_api_key}`,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (data) {
          if (data.allowed_status.length === 0) {
            toastr["error"]("Workflow is not define");
          } else {
            var project = data;
            var trackers = data.allowed_status;
            var rowtext = $(`tr#${rowId}`).find("td.status").text();
            var issue_tracker = rowtext.split("\n")[0];
            var status_dropdown = "<select id= status_" + rowId + ">";
            for (let i = 0; i < trackers.length; i++) {
              status_dropdown +=
                `<option ${
                  issue_tracker == trackers[i].name ? "selected" : ""
                } value = ${trackers[i].id}>` +
                trackers[i].name +
                "</option>";
            }
            $(`tr#${rowId} td#${tdId}`).append(status_dropdown);
          }
        },
        error: function () {},
      });
    }
    async function checkPluginEnabled(issueId) {
      try {
        const data = await $.ajax({
          url: `${url}/${issueId}/check_agile_board_enabled.json?key=${issue_api_key}`,
          type: "GET",
          crossDomain: true,
          dataType: "json",
          data: { limit: 100 },
        });
    
        return data.agile_board_enabled;
    
      } catch (error) {
        console.error("Error:", error);
        return false; // Return false if there's an error
      }
    }  
    function prepareForEdit(temp_this) {
      $(temp_this).closest("tr").removeClass("hascontextmenu");
      var currentRow = $(temp_this).closest("tr");
      var currentColumn = $(temp_this).closest("td");
      var Id = currentRow.find("td.id").text();
      var issue_id = Id;
      issueId = parseInt(issue_id);
      var clickedtd = $(temp_this).closest("td").attr("class");
      var clickedtd_split = clickedtd.split(" ")[0];
      var cf_Id = clickedtd.substring(3, 5);
      if (tdId != "") {
        $(`#${tdId}`).remove();
        var data = tdId.split("-");
        $(`td#issue_${data[1]}_id-${data[3]}`).css("display", "revert");
      }
      $("document").on("click", function (e) {
        var $target = $(e.target);
        if (!$target.closest("table").length) {
          // Click occurred outside table, remove tdId
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
      tdId = `dynamic-${clickedtd_split}-edit-${issueId}`;
      $(currentRow)
        .find(currentColumn)
        .attr("id", `issue_${clickedtd_split}_id-${issueId}`);
      currentTdClass = $(temp_this).closest("td").attr("id");
      project_name = currentRow.find("td.project").text();
      projectId = currentRow.find("td.id").text();
      $(".edit-issue").css("display", "none");
      $(`<td id = ${tdId}></td>`).insertAfter("#" + currentTdClass);
      currentRow.find("td#" + currentTdClass).css("display", "none");
      $(temp_this).css("display", "none");
      return {
        rowId,
        issueId,
        tdId,
        currentTdClass,
        currentRow,
        projectId,
        // eslint-disable-next-line no-dupe-keys
        tdId,
      };
    }
    $(document).on("click", function (event) {
      if (
        !$(event.target).closest("select[id^='story_points-']").length &&
        !$(event.target).closest(".edit-issue").length &&
        !$(event.target).is(".edit-issue")
      ) {
        $("select[id^='story_points-']").hide();
        $(".td_text").show();
      }
    });
  }
});

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Date Range picker</title>
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"
    ></script>
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"
    ></script>
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"
    ></script>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css"
    />

    <style>
      /* border bottom for thead first row
        used after as different browser doesn't support margin padding for tr tag
      */
      .table-condensed > thead > tr:nth-child(1)::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #ddd;
        transform: translateY(5px);
      }
      /* move thead first row up to make more aesthetic*/
      .table-condensed > thead > tr:nth-child(1) {
        position: relative;
        height: 40px;
        transform: translateY(-10px);
      }

      /* increased padding top bcz of thead 1st tr tranlation of 5px */
      .daterangepicker .drp-calendar {
        padding: 10px 0 8px 8px;
      }

      /* remove bolding of thead */
      .table-condensed > thead > tr > th {
        font-weight: 400;
      }

      /* increased font size of month heading */
      .table-condensed > thead > tr:nth-child(1) > th {
        font-size: 15px;
      }

      /* setting of arrow in span tag  */
      .dblLeft > span,
      .dblRight > span,
      .prev > span,
      .next > span {
        color: #fff;
        border: solid #ddd;
        border-color: #ddd !important;
        border-width: 0 2px 2px 0;
        border-radius: 0;
        display: inline-block;
        padding: 3px;
      }

      /* angle for arrow */
      .dblLeft > span {
        transform: rotate(135deg);
      }

      .dblRight > span {
        transform: rotate(-45deg);
      }

      /* hover effect for arrows*/
      .prev.available:hover,
      .next.available:hover,
      .dblLeft:has(> span):hover,
      .dblRight:has(> span):hover {
        background-color: #ebf4f8 !important;
        border-color: transparent;
        border-radius: 70%;
      }
    </style>
  </head>

  <body>
    <div class="picker">
      <input
        type="text"
        id="daterange"
        class="customDateRangePicker"
        placeholder="Date"
        readonly
      />
    </div>
  </body>

  <script>
    $(document).ready(function () {
      const dateRange = $("#daterange").daterangepicker(
        {
          parentEl: "picker",
          autoApply: true, // false then apply and cancel button will be shown

          /* default date range
          eg:-
            startDate: moment().subtract(6, "days"),
            endDate: moment(),
          */

          // configurations
          drops: "auto",
          showCustomRangeLabel: false,
          alwaysShowCalendars: true,
          linkedCalendars: false, // always show sequentials calendar - jan, feb

          // format of value
          locale: {
            format: "MM/DD/YYYY",
          },

          /* restrict date range, 
          eg:-
            minDate: "05/03/2024",
            maxDate: "06/02/2024",
          */
        },

        (start, end, label) => {
          /* 
            callback whenever range changes
            useful to set data or to run any side effects
          */
          console.log(
            `Selected range ${start.format("YYYY-MM-DD")} - ${end.format(
              "YYYY-MM-DD"
            )} predefined range : ${label})`
          );
        }
      );

      /*
       * Customization for year navigation
       * @param {event} e - event
       */
      const prevYear = (e) => {
        // to return when clicked on tr with no children (basically hidden )
        if ($(e.target).children().length === 0 && e.target.tagName !== "SPAN")
          return;

        var cal = $(e.target).parents(".drp-calendar");

        if (cal.length > 0) {
          const context = $("#daterange").data("daterangepicker");
          if (cal.hasClass("left"))
            context.leftCalendar.month.subtract(1, "year");
          else context.rightCalendar.month.subtract(1, "year");
          context.updateCalendars();
        }
      };
      const nextYear = (e) => {
        // to return when clicked on tr with no children (basically hidden )
        if ($(e.target).children().length === 0 && e.target.tagName !== "SPAN")
          return;

        var cal = $(e.target).parents(".drp-calendar");

        if (cal.length > 0) {
          const context = $("#daterange").data("daterangepicker");
          if (cal.hasClass("left")) context.leftCalendar.month.add(1, "year");
          else context.rightCalendar.month.add(1, "year");

          context.updateCalendars();
        }
      };

      /**
       * Generate navigation year arrows
       * @param {string} side - left or right side calendar
       */
      const generateNavigationYear = (side) => {
        const context = $("#daterange").data("daterangepicker");

        // not supported for linkedCalendars as does not make sense
        if (!context.linkedCalendars) {
          $(".month").attr("colspan", 3);

          let calendar =
            side == "left" ? context.leftCalendar : context.rightCalendar;
          let minDate =
            side == "left"
              ? context.minDate
              : context.leftCalendar.month.clone().startOf("month");
          let maxDate =
            side == "right"
              ? context.maxDate
              : context.rightCalendar.month.clone().endOf("month");

          // left dbl arrow
          let dblLeftHtml = `<th class="dblLeft ${side}Side">`;
          if (
            !minDate ||
            minDate.isSameOrBefore(
              calendar.month.clone().subtract(1, "year").startOf("month")
            )
          ) {
            dblLeftHtml += `<span></span><span></span></th>`;
          } else {
            dblLeftHtml += "</th>";
          }

          var leftArrow = $(`.${side} .prev.available`);
          var dblLeftArrowExists =
            $(`.${side} .dblLeft.${side}Side`).length > 0;

          // render dbl left arrow
          if (!dblLeftArrowExists) {
            if (leftArrow.length > 0) {
              leftArrow.before(dblLeftHtml);
            } else {
              const hiddenLeftArrow = $(`.${side} .month`).prev();
              hiddenLeftArrow.before(dblLeftHtml);
            }
          }

          // right calendar
          let dblRightHtml = `<th class="dblRight ${side}Side">`;
          if (
            !maxDate ||
            maxDate.isSameOrAfter(
              calendar.month.clone().add(1, "year").startOf("month")
            )
          ) {
            dblRightHtml += `<span></span><span></span></th>`;
          } else {
            dblRightHtml += "</th>";
          }

          // render dbl right arrow
          var rightArrow = $(`.${side} .next.available`);
          var dblRightArrowExists =
            $(`.${side} .dblRight.${side}Side`).length > 0;

          if (!dblRightArrowExists) {
            if (rightArrow.length > 0) {
              rightArrow.after(dblRightHtml);
            } else {
              const hiddenRightArrow = $(`.${side} .month`).next();
              hiddenRightArrow.after(dblRightHtml);
            }
          }

          /**
           * Edge cases
           * logic related to removing left and right arrow when same month in same year for left and right calendar
           */
          // edge case don't show left arrow when left calendar and right calendar showing same month in same year
          if (
            side == "right" &&
            minDate.isSameOrAfter(calendar.month.clone().startOf("month"))
          ) {
            $(`.right .prev.available`).removeClass("prev available").html();
          }

          // edge case don't show right arrow when left calendar and right calendar showing same month in same year
          if (
            side == "left" &&
            maxDate.isSameOrBefore(calendar.month.clone().endOf("month"))
          ) {
            $(`.left .next.available`).removeClass("next available").html();
          }
        }
      };

      // override default renderCalendar to add custom navigation year
      const defaultRenderCalendar =
        $("#daterange").data("daterangepicker").renderCalendar;
      $("#daterange").data("daterangepicker").renderCalendar = function (e) {
        defaultRenderCalendar.call($("#daterange").data("daterangepicker"), e);

        generateNavigationYear(e);

        // added click event for dbl arrows, event delegation usage was not working so had to resort to this
        $(".dblLeft").click(prevYear);
        $(".dblRight").click(nextYear);
      };
    });
  </script>
</html>

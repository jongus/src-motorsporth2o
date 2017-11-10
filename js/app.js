//Foundation.Abide.defaults.patterns['boat_numbers'] = /^[1-9][0-9]{0,3}$/;
Foundation.Abide.defaults.patterns['boat_numbers'] = /^[0-9]{1,4}$/;
Foundation.Abide.defaults.patterns['phone_number'] = /^[+]{0,1}[0-9' ''\-''('')']{7,20}$/;

$(document).foundation()

$( document ).ready(function() {

    //Load last entry date
    $("#loadingsignupsection").removeClass("hide");
    $.ajax({
        url: getCompetitionInfo,
        dataType: "json",
        type: "post",
        data: JSON.stringify({"PartitionKey": partitionKey }),
        traditional: true,
        contentType: "application/json",
        success:function(data) {
            $("#loadingsignupsection").addClass("hide");
            if(data.IsOkay == false){
                $("#errorModalHeading").html(errorHeading[data.MessageId]);
                $("#errorModalText").html(errorText[data.MessageId] + " " + data.ErrorMessage + " getCompetitionInfo");
                $("#errorModalLink").trigger("click");
                alert("getCompetitionInfo");
                //Remove all data
            } else {
                if(data.EntryOpen == false){
                    $("#nosignupform").removeClass("hide");
                    $("#signupform").addClass("hide");
                } else {
                    $("#signupform").removeClass("hide");
                    $("#nosignupform").addClass("hide");
                }
                loadCompetitors();
            }
        },
        error: function(xhr,status,error) {
            $("#loadingsignupsection").addClass("hide");
            $("#errorModalHeading").html("Nu hände det något dåligt");
            $("#errorModalText").html("Tyvärr verkar det som servern är nere, något gick i varje fall inte som det skulle. <br>&nbsp;<br>All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.<br>&nbsp;<br> " + error + " getCompetitionInfo");
            $("#errorModalLink").trigger("click");
        }
    });

    $(".numbers").keypress(function (e) {
        if (String.fromCharCode(e.keyCode).match(/[^0-9]/g)) return false;
    });

    $("#signupform").on("formvalid.zf.abide", function(ev,frm) {
        $("#PartitionKey").val(partitionKey);
        $("#RowKey").val("");
        var form = $('#signupform');
        var jsonData = {};
        $.each($(form).serializeArray(), function() {
            jsonData[this.name] = this.value;
        });

        $.ajax({
            url: addEntry,
            dataType: "json",
            type: "post",
            data: JSON.stringify(jsonData),
            traditional: true,
            contentType: "application/json",
            success:function(data) {
                if(data.IsOkay == false){
                    $("#errorModalHeading").html(errorHeading[data.MessageId]);
                    $("#errorModalText").html(errorText[data.MessageId] + " " + data.ErrorMessage + " addEntry");
                    $("#errorModalLink").trigger("click");
                } else {
                    $("#PartitionKey").val("");
                    $("#RowKey").val("");
                    $("#BoatNumber").val("");
                    $("#TeamName").val("");
                    $("#DriverName").val("");
                    $("#DriverClub").val("");
                    $("#DriverLicenseNumber").val("");
                    $("#CoDriverName").val("");
                    $("#CoDriverClub").val("");
                    $("#CoDriverLicenseNumber").val("");
                    $("#Email").val("");
                    $("#Mobile").val("");
                    $("#HullMake").val("");
                    $("#EngineMake").val("");
                    //Tack för din anmälan
                    $("#errorModalHeading").html(responseHeading[0]);
                    $("#errorModalText").html(responseText[0]);
                    $("#errorModalLink").trigger("click");
                    //Update participant list
                    loadCompetitors();
                }
            },
            error: function(xhr,status,error) {
                $("#errorModalHeading").html(errorHeading[2]);
                $("#errorModalText").html(errorText[2] + " All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.<br>&nbsp;<br> " + error + " addEntry");
                $("#errorModalLink").trigger("click");
                //Remove all data
            }
        });
    });

    $("#signupform").bind("submit",function(e) {
      e.preventDefault();
      return false;
    });

    $("#updateCompetitors").click( function(ev) {
        loadCompetitors();
        ev.preventDefault();
    });

    function loadCompetitors() {
        $("#loadingparticimpantssection").removeClass("hide");
        $("#particimpantssection").addClass("hide");
        $.ajax({
            url: getEntriesHtml,
            dataType: "html",
            type: "post",
            data: JSON.stringify({"PartitionKey": partitionKey }),
            traditional: true,
            contentType: "application/json",
            success:function(data) {
                if(data == "5") {
                    //No competitors, hide table, show no info
                    $("#noparticimpantssection").removeClass("hide");
                    $("#particimpantssection").addClass("hide");
                    $("#loadingparticimpantssection").addClass("hide");
                    $("#testH2").html("555555555");
                } else if(data == "2") {
                    //Something else is wrong
                    $("#noparticimpantssection").addClass("hide");
                    $("#particimpantssection").addClass("hide");
                    $("#loadingparticimpantssection").addClass("hide");
                    $("#errorModalHeading").html(errorHeading[2]);
                    $("#errorModalText").html(errorText[2] + " getEntriesHtml");
                    $("#errorModalLink").trigger("click");
                } else {
                    //We have som nice data, show table!
                    $("#noparticimpantssection").addClass("hide");
                    $("#loadingparticimpantssection").addClass("hide");
                    $("#particimpantssection").removeClass("hide");
                    $("#list-inner").html(data);
                }
            },
            error: function(xhr,status,error) {
                $("#noparticimpantssection").addClass("hide");
                $("#particimpantssection").addClass("hide");
                $("#loadingparticimpantssection").addClass("hide");
                $("#errorModalHeading").html(errorHeading[2]);
                $("#errorModalText").html(errorText[2] + " All work and no play makes Jack a dull boy. All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.  All work and no play makes Jack a dull boy.<br>&nbsp;<br> " + error + " getEntriesHtml");
                $("#errorModalLink").trigger("click");
                //Remove all data
            }
        });
    }

});

var msg_AjaxErr = "An error occurred while trying to get information from the server";
//setCookie("VB3userID", "", 180);
var Provider = "";
var ModalWin
var AutoUser = "";
var colDia = [];
var colParts = [];
var colEnds = ["FL-Glv", "FL-CS", "FL-S", "RL", "Hose"];

$(document).ready(function () {
    
    for (var i = 3; i < 73; i++) {
        colDia.push(i);
    }
    
    $("#panConfigurator").kendoPanelBar({

    });

    $("#cmbMatType").kendoDropDownList({
        dataSource: ["Galvanized", "Stainless Steel 304", "Carbon Steel"],
        change: function () {
            
        }
    });

    $("#cmbRLGasketType").kendoDropDownList({
        dataSource: ["Buna-N", "HT/FDA", "GoreTex","Viton"],
        change: function () {

        }
    });

    $("#cmbFLGasketType").kendoDropDownList({
        dataSource: ["None", "Neoprene"],
        change: function () {

        }
    });

    $("#cmbBraType").kendoDropDownList({
        dataSource: ["Single Branch", "Double Branch", "Y-Branch", "T-Branch", "In-Cut"],
        change: function () {
            if (this.value() === "Double Branch") {
                $("#divBraDiaD").show();
                $("#divBraEndD").show();
                $("#divBraEndA").show();
            } else if (this.value() === "In-Cut") {
                $("#divBraDiaD").hide();
                $("#divBraEndD").hide();
                $("#divBraDiaC").hide();
                $("#divBraEndC").hide();
                $("#divBraEndA").hide();
            } else {
                $("#divBraDiaD").hide();
                $("#divBraEndD").hide();
                $("#divBraDiaC").show();
                $("#divBraEndC").show();
                $("#divBraEndA").show();
            }
        }
    });

    $("#cmbDiaA").kendoDropDownList({
        dataSource: colDia
    });

    $("#cmbEndA").kendoDropDownList({
        dataSource: colEnds
    });

    $("#cmbDiaB").kendoDropDownList({
        dataSource: colDia
    });

    $("#cmbEndB").kendoDropDownList({
        dataSource: colEnds
    });

    $("#cmbDiaC").kendoDropDownList({
        dataSource: colDia
    });

    $("#cmbEndC").kendoDropDownList({
        dataSource: colEnds
    });
    $("#cmbDiaD").kendoDropDownList({
        dataSource: colDia
    });

    $("#cmbEndD").kendoDropDownList({
        dataSource: colEnds
    });

    $("#cmbElbEndA").kendoDropDownList({
        dataSource: colEnds,
        change: function () {
            $("#cmbElbEndB").data("kendoDropDownList").value(this.value());                    
        }
    });

    $("#cmbElbEndB").kendoDropDownList({
        dataSource: colEnds
    });

    $("#cmbAngle").kendoDropDownList({
        dataSource: ["45","30"]
    });

    $("#cmbElbAngle").kendoDropDownList({
        dataSource: ["90", "60","45","30"]
    });

    $("#cmbElbType").kendoDropDownList({
        dataSource: ["Stitch Welded", "Tubed", "Gored/Segmented"],
        change: function () {
            
        }
    });

    $("#cmbElbRadius").kendoDropDownList({
        dataSource: ["1xD", "1.5xD", "2.5xD"],
        change: function () {

        }
    });

    $("#cmbElbRadius").data("kendoDropDownList").value("1.5xD")

    $("#cmbElbDia").kendoDropDownList({
        dataSource: colDia
    });

    $("#cmbDucDia").kendoDropDownList({
        dataSource: colDia,
        change: function () {
            $("#cmbElbDia").data("kendoDropDownList").value(this.value());
            $("#cmbDiaA").data("kendoDropDownList").value(this.value());
            $("#cmbDiaB").data("kendoDropDownList").value(this.value());
            $("#cmbDiaC").data("kendoDropDownList").value(this.value());
            $("#cmbDiaD").data("kendoDropDownList").value(this.value());
        }
    });

    $("#cmbSetEnd").kendoDropDownList({
        dataSource: colEnds,
        change: function () {
            $("#cmbDucEndA").data("kendoDropDownList").value(this.value());
            $("#cmbElbEndA").data("kendoDropDownList").value(this.value());
            $("#cmbDucEndB").data("kendoDropDownList").value(this.value());
            $("#cmbElbEndB").data("kendoDropDownList").value(this.value());
            $("#cmbEndA").data("kendoDropDownList").value(this.value());
            $("#cmbEndB").data("kendoDropDownList").value(this.value());
            $("#cmbEndC").data("kendoDropDownList").value(this.value());
            $("#cmbEndD").data("kendoDropDownList").value(this.value());
        }
    });

    $("#cmbDucEndA").kendoDropDownList({
        dataSource: colEnds,
        change: function () {
            $("#cmbDucEndB").data("kendoDropDownList").value(this.value());
        }
    });

    $("#cmbDucEndB").kendoDropDownList({
        dataSource: colEnds
    });

    $("#grdBOM").kendoGrid({
        scrollable: true,                
        columns: [
            {
                field: "Quantity",
                title: "Qty",
                
                attributes: { style: "text-align: right" },
                footerTemplate: "<div style='text-align:right;'>#=parseFloat(sum).toFixed(0)#</div>"
            },
            {
                field: "ItemNo",
                title: "Item No"
            },
            
            {
                field: "Description",
                title: "Description"
            },

            {

                field: "ShowRate",
                title: "Price",
                
                template: "<div style='text-align:right;'>#= ShowRate.toFixed(2) #</div>"

            },
            {

                field: "ShowAmount",
                title: "Ext. Price",
                
                template: "<div style='text-align:right;'>#= ShowAmount.toFixed(2) #</div>",
                footerTemplate: "<div style='text-align:right;'>#= parseFloat(sum).toFixed(2) #</div>"

            }

        ],
        dataSource: {

            aggregate: [{ field: "Quantity", aggregate: "sum" },
            { field: "Weight", aggregate: "sum" },
            { field: "ShowAmount", aggregate: "sum" }],
            model: {
                fields: {
                    
                    Quantity: { type: "number" },
                    ItemNo: { type: "string" },                            
                    Description: { type: "string" },
                    Weight: { type: "number" },
                    ShowRate: { type: "number" },
                    ShowAmount: { type: "number" }
                }
            }
        }
    });
});
        
$(window).resize(function () {
    $("#grdBOM").data("kendoGrid").resize();
});


function addDuct(btnPos) {
    var Qty = parseFloat($("#numDucQty").val());
    var p = { Quantity: Qty, ItemNo: "D" + $("#cmbDucDia").data("kendoDropDownList").value(), Description: "Duct " + $("#cmbDucDia").data("kendoDropDownList").value() , Weigth: 0 , ShowRate: 5, ShowAmount: 5*Qty  }
    colParts.push(p);
    setData();

    // NEW - ADDED btnPos
    popupNotification(p, btnPos);
}

function addElbow(btnPos) {
    var Qty = parseFloat($("#numElbQty").val());
    var p = { Quantity: Qty, ItemNo: "E" + $("#cmbElbDia").data("kendoDropDownList").value(), Description: "Elbow " + $("#cmbElbDia").data("kendoDropDownList").value(), Weigth: 0, ShowRate: 50, ShowAmount: 50 * Qty }
    colParts.push(p);
    setData();

    // NEW - ADDED btnPos
    popupNotification(p, btnPos);
}

function addBranch(btnPos) {
    var Qty = parseFloat($("#numBraQty").val());
    var p = { Quantity: Qty, ItemNo: "B" + $("#cmbDiaA").data("kendoDropDownList").value(), Description: "Branch " + $("#cmbDucDia").data("kendoDropDownList").value(), Weigth: 0, ShowRate: 100, ShowAmount: 100 * Qty }
    colParts.push(p);
    setData();

    // NEW - ADDED btnPos
    popupNotification(p, btnPos);
}

function popupNotification(p, btnPos) {
    
    var notification = $("#notification").kendoNotification({
            // NEW - updated position object
            position: {
                pinned: false,
                top: btnPos.top,
                right: btnPos.right
            },
            autoHideAfter: 3000,
            stacking: "down",
            templates: [{
                type: "success",
                template: $("#successTemplate").html()
            }]

        }).data("kendoNotification");

    var qty = p.Quantity;
    var itemNo = p.ItemNo;
    var description = p.Description;
    var cost = p.ShowAmount;
    var msg = `Added to BOM:  ${qty}x  ${description} (${itemNo}) - $${cost}.00`;

    notification.show({
            message: msg
        }, "success");
}

function setData() {
    var dsC = new kendo.data.DataSource({
        aggregate: [{ field: "Quantity", aggregate: "sum" },
        { field: "Weight", aggregate: "sum" },
        { field: "ShowAmount", aggregate: "sum" }],
        data: colParts
    })
    $("#grdBOM").data("kendoGrid").setDataSource(dsC);
}

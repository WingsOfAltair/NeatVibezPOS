import { Component, OnInit, HostListener } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { SmartTableData } from "../../../@core/data/smart-table";
import {
  NbDialogService,
  NbSortDirection,
  NbSortRequest,
  NbToastrService,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbWindowService,
} from "@nebular/theme";
import { CloseModelRegisterComponent } from "../close-model-register/close-model-register.component";
import { PublisherService } from "../../../services/publisher.service";
import { OpenRegisterModalComponent } from "../open-register-modal/open-register-modal.component";
import { UpdateQuantityComponent } from "../update-quantity/update-quantity.component";
import { PaymentModalComponent } from "../../screens/payment-modal/payment-modal.component";
import { PickItemModalComponent } from "../pick-item-modal/pick-item-modal.component";
import { PerivousBillComponent } from "../perivous-bill/perivous-bill.component";
import { RefundItemModalComponent } from "../refund-item-modal/refund-item-modal.component";

@Component({
  selector: "ngx-cash",
  templateUrl: "./cash.component.html",
  styleUrls: ["./cash.component.scss"],
})
export class CashComponent implements OnInit {
  data: any;
  filterdata: any;

  defaultColumns = [
    "Picture",
    "ItemName",
    "ItemQuantity",
    "ItemBarcode",
    "ClientPrice",
    "Action",
  ];

  allColumns = [...this.defaultColumns];

  dataSource: NbTreeGridDataSource<any>;

  ScannedBarcode = '';

  currentSelectedBill :any = null;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  Userdata: any;
  userID: any;
  date: Date;
  message: any;
  logo: any;
  currentdate: Date;
  dataa: any[] = [];
  selectedfilter: any[] = [];
  UpdateTable: any[] = [];
  itemlist: any[] = [];
  secoundDeleteTable: any[] = [];
  deleteitem: any[] = [];
  perviousitem: any[] = [];
  pandingdata: any[] = [];
  allbills: any[] = [];
  perivoustotal: number;
  perivouspaid: number;
  perivousreminder: number;
  pandingbill: any;
  billno: any;
  bill: number;
  billID: any;
  demoID: number;
  PreviousPickedItem: any[] = [];
  codegenerate: any[] = [];
  paydata: any[] = [];
  paydataa: any[] = [];
  random: number;
  random2: number;
  billquantity = 0;
  total: number;
  filtercode: any;
  storeName: any;
  
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.ScannedBarcode += event.key;
    console.log(`Key pressed: ${this.ScannedBarcode}`);

    var obj = {
      ItemBarCode: this.ScannedBarcode,
    };
    
    this.publisherService
      .PostRequest("SearchInventoryItemsWithBarCode", obj)
      .subscribe((res: any) => {
        var response = JSON.parse(res);
        var data = response.ResponseMessage.Item1;
        
        if (data.ItemName){
          this.ScannedBarcode = '';
          
          var newItem = {
            data: {
              ItemID: data.ItemID,
              Picture: 'data:' + 'image/png' + ';base64,' + data["Picture"].slice(1, -1),
              ItemName: data.ItemName,
              ItemQuantity: 1,
              ItemBuyPrice: data.ItemBuyPrice,
              ItemPrice: data.ItemPrice,
              ItemPriceTax: data.ItemPriceTax,
              favoriteCategoryName: data.favoriteCategoryName,
              FavoriteCategory: data.FavoriteCategory,
              warehouseName: data.warehouseName,
              ItemTypeName: data.ItemTypeName,
              ItemBarCode: data.ItemBarCode,
              RandomCode: this.random,
            }, randomcode: this.random2,
          };

          var totalAmount = 0;
          var billAmount = 0;
          var totalquantity = 0;
          var amount = [];
  
          if (this.paydata.length > 0) {
            console.log("paydata 1")
            console.log(this.paydata);
            if (this.currentSelectedBill != null)
              var barcode = this.paydata.filter((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
            else var barcode = this.paydata.filter((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
            console.log("barcode 1")
            console.log(barcode);
            console.log("random")
            console.log(this.random)
            console.log("random2")
            console.log(this.random2)
            if (barcode.length > 0) {
              console.log("currentselectedbill")
              console.log(this.currentSelectedBill)
              var selected = null;
              var selected2 = null;
              var selected3 = null;
              if (this.currentSelectedBill != null) {
                console.log("A1")
                console.log("newItem.data.ItemBarCode")
                console.log(newItem.data.ItemBarCode)
                selected = this.paydata.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
                selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
                selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
              }
              else {
                console.log("A2")
                selected = this.paydata.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
                selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
                selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
              }
              console.log("selected 1 1")
              console.log(selected)
              console.log("selected 2 1")
              console.log(selected2)
              console.log("selected 3 1")
              console.log(selected3)
              if (selected !== -1 && newItem.data.ItemQuantity !== 0) {
                if (selected !== -1) {
                  this.paydata[selected].data.ItemQuantity += 1;
                }
                if (selected2 !== -1) {
                  this.codegenerate[selected2].data.ItemQuantity += 1;
                }
                if (selected3 !== -1) {
                  this.paydata.forEach((el) => {
                    var obj = {
                      data: {
                        ItemID: el.data.ItemID,
                        Picture: el.data.Picture,
                        ItemName: el.data.ItemName,
                        ItemQuantity: el.data.ItemQuantity,
                        ItemBuyPrice: el.data.ItemBuyPrice,
                        ItemPrice: el.data.ItemPrice,
                        ItemPriceTax: el.data.ItemPriceTax,
                        favoriteCategoryName: el.data.favoriteCategoryName,
                        FavoriteCategory: el.data.FavoriteCategory,
                        warehouseName: el.data.warehouseName,
                        ItemTypeName: el.data.ItemTypeName,
                        ItemBarCode: el.data.ItemBarCode,
                        RandomCode: this.random,
                      }, randomcode: this.random2
                    };
                    this.PreviousPickedItem.push(obj);
                  });

                  this.PreviousPickedItem.forEach((el) => {
                    var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
                    billAmount += individualAmount;
              
                    console.log(individualAmount);
                  });
                  amount.push(billAmount);
                  this.perviousitem = this.PreviousPickedItem;
              
                  this.PreviousPickedItem.forEach((el) => {
                    var individualAmount = el.data.ItemQuantity;
                    totalquantity += individualAmount;
              
                    console.log(totalquantity);
                  });
              
                  this.billquantity = this.PreviousPickedItem.length;

                  this.allbills[selected3].data.ItemName = this.billquantity;
                  this.allbills[selected3].data.ItemQuantity = totalquantity;
                  this.allbills[selected3].data.ItemPrice = billAmount;
              
                  //this.pandingbill = this.allbills.push(obj);
              
                  this.allbills.forEach((el) => {
                    var individualAmount = el.data.ItemPrice;
                    totalAmount += individualAmount;
              
                    console.log(individualAmount);
                  });
                  amount.push(totalAmount);
              
                  this.PreviousPickedItem = [];
                  this.pandingdata = [];
                }
    
                this.paydata.forEach((el) => {
                  var obj = {
                    ItemName: el.data.ItemName,
                    ItemQuantity: el.data.ItemQuantity,
                    ItemPrice: el.data.ItemPrice,
                  };
                  this.selectedfilter.push(obj);
                });
                this.dataSource = this.dataSourceBuilder.create(this.paydata);
              } else {
                this.toastrService.danger("Try Again", "Minimum 1 Quantity");
              }
            } else {
              this.paydata.push(newItem);
              this.dataa.push(newItem);
              this.paydataa.push(newItem.data);
              this.pandingdata = this.paydataa;
              this.dataSource = this.dataSourceBuilder.create(this.paydata);
              
              var selected = null;
              var selected2 = null;
              var selected3 = null;

              if (this.currentSelectedBill != null) {
                console.log("A1")
                console.log("newItem.data.ItemBarCode")
                console.log(newItem.data.ItemBarCode)
                selected = this.paydata.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
                selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
                selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
              }
              else {
                console.log("A2")
                selected = this.paydata.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
                selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
                selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
              }

              if (selected3 !== -1) {
                this.paydata.forEach((el) => {
                  var obj = {
                    data: {
                      ItemID: el.data.ItemID,
                      Picture: el.data.Picture,
                      ItemName: el.data.ItemName,
                      ItemQuantity: el.data.ItemQuantity,
                      ItemBuyPrice: el.data.ItemBuyPrice,
                      ItemPrice: el.data.ItemPrice,
                      ItemPriceTax: el.data.ItemPriceTax,
                      favoriteCategoryName: el.data.favoriteCategoryName,
                      FavoriteCategory: el.data.FavoriteCategory,
                      warehouseName: el.data.warehouseName,
                      ItemTypeName: el.data.ItemTypeName,
                      ItemBarCode: el.data.ItemBarCode,
                      RandomCode: this.random,
                    }, randomcode: this.random2
                  };
                  this.PreviousPickedItem.push(obj);
                });

                this.PreviousPickedItem.forEach((el) => {
                  var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
                  billAmount += individualAmount;
            
                  console.log(individualAmount);
                });
                amount.push(billAmount);
                this.perviousitem = this.PreviousPickedItem;
            
                this.PreviousPickedItem.forEach((el) => {
                  var individualAmount = el.data.ItemQuantity;
                  totalquantity += individualAmount;
            
                  console.log(totalquantity);
                });
            
                this.billquantity = this.PreviousPickedItem.length;

                this.allbills[selected3].data.ItemName = this.billquantity;
                this.allbills[selected3].data.ItemQuantity = totalquantity;
                this.allbills[selected3].data.ItemPrice = billAmount;
            
                this.allbills.forEach((el) => {
                  var individualAmount = el.data.ItemPrice;
                  totalAmount += individualAmount;
            
                  console.log(individualAmount);
                });
                amount.push(totalAmount);
            
                this.PreviousPickedItem = [];
                this.pandingdata = [];
              }

              this.itemlist = [];
            }
          } else {
            console.log("dataa 1")
            console.log(this.dataa);
            if (this.currentSelectedBill != null)
              var barcode = this.dataa.filter((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
            else var barcode = this.dataa.filter((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
            console.log("barcode 2")
            console.log(barcode);
            console.log("random")
            console.log(this.random)
            console.log("random2")
            console.log(this.random2)
            if (barcode.length > 0) {
              console.log("currentselectedbill")
              console.log(this.currentSelectedBill)
              var selected = null;
              var selected2 = null;
              var selected3 = null;
              if (this.currentSelectedBill != null) {
                console.log("B1")
                selected = this.dataa.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
                selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
                selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
              }
              else {
                console.log("B2")
                selected = this.dataa.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
                selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
                selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
              }
              console.log("selected 1 2")
              console.log(selected)
              console.log("selected 2 2")
              console.log(selected2)
              console.log("selected 3 2")
              console.log(selected3)
              if (selected !== -1 && newItem.data.ItemQuantity !== 0) {
                if (selected !== -1) {
                  this.dataa[selected].data.ItemQuantity += 1;
                }
                if (selected2 !== -1) {
                  this.codegenerate[selected2].data.ItemQuantity += 1;
                }
                if (selected3 !== -1) {
                  this.dataa.forEach((el) => {
                    var obj = {
                      data: {
                        ItemID: el.data.ItemID,
                        Picture: el.data.Picture,
                        ItemName: el.data.ItemName,
                        ItemQuantity: el.data.ItemQuantity,
                        ItemBuyPrice: el.data.ItemBuyPrice,
                        ItemPrice: el.data.ItemPrice,
                        ItemPriceTax: el.data.ItemPriceTax,
                        favoriteCategoryName: el.data.favoriteCategoryName,
                        FavoriteCategory: el.data.FavoriteCategory,
                        warehouseName: el.data.warehouseName,
                        ItemTypeName: el.data.ItemTypeName,
                        ItemBarCode: el.data.ItemBarCode,
                        RandomCode: this.random,
                      }, randomcode: this.random2
                    };
                    this.PreviousPickedItem.push(obj);
                  });

                  this.PreviousPickedItem.forEach((el) => {
                    var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
                    billAmount += individualAmount;
              
                    console.log(individualAmount);
                  });
                  amount.push(billAmount);
                  this.perviousitem = this.PreviousPickedItem;
              
                  this.PreviousPickedItem.forEach((el) => {
                    var individualAmount = el.data.ItemQuantity;
                    totalquantity += individualAmount;
              
                    console.log(totalquantity);
                  });
              
                  this.billquantity = this.PreviousPickedItem.length;

                  this.allbills[selected3].data.ItemName = this.billquantity;
                  this.allbills[selected3].data.ItemQuantity = totalquantity;
                  this.allbills[selected3].data.ItemPrice = billAmount;
              
                  //this.pandingbill = this.allbills.push(obj);
              
                  this.allbills.forEach((el) => {
                    var individualAmount = el.data.ItemPrice;
                    totalAmount += individualAmount;
              
                    console.log(individualAmount);
                  });
                  amount.push(totalAmount);
              
                  this.PreviousPickedItem = [];
                  this.pandingdata = [];
                }
    
                this.dataa.forEach((el) => {
                  var obj = {
                    ItemName: el.data.ItemName,
                    ItemQuantity: el.data.ItemQuantity,
                    ItemPrice: el.data.ItemPrice,
                  };
                  this.selectedfilter.push(obj);
                });
                this.dataSource = this.dataSourceBuilder.create(this.dataa);
              } else {
                this.toastrService.danger("Try Again", "Minimum 1 Quantity");
              }
            } else {
              this.dataa.push(newItem);
              this.paydata.push(newItem);
              this.paydataa.push(newItem);
              this.itemlist.push(newItem.data);
              this.pandingdata = this.itemlist;
              this.dataSource = this.dataSourceBuilder.create(this.dataa);
            }
          }
        }
      });
  }

  @HostListener('document:keydown', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      console.log('Escape key was pressed');
      this.ScannedBarcode = '';
    }
  }

  @HostListener("document:keydown.f1", ["$event"])
  handleF1Key(event: KeyboardEvent) {
    event.preventDefault(); // Prevent the default behavior of the F1 key (e.g., opening browser help)
    this.openDialog(); // Call a function to open your dialog
  }

  openDialog() {
    // Use NbDialogService to open your dialog
    this.windowService.open(RefundItemModalComponent, {
      title: `Item Refund`,
    });
  }
  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }
  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }

  constructor(
    private dialogService: NbDialogService,
    private publisherService: PublisherService,
    private windowService: NbWindowService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
    private toastrService: NbToastrService
  ) {
    var user = sessionStorage.getItem("userData");
    this.Userdata = JSON.parse(user);
    this.userID = this.Userdata.uid;

    this.date = new Date();
  }

  ngOnInit(): void {

    this.publisherService
    .PostRequest("RetrieveSystemSettings", "")
    .subscribe((res: any) => {
      var response = JSON.parse(res);
      this.message = JSON.parse(response.ResponseMessage.Item1);

      this.storeName = this.message[0].SystemName;
    });

    var obj = {
      locale: 1,
    };
    
    this.publisherService
      .PostRequest("RetrieveItems", obj)
      .subscribe((res: any) => {
        console.log(JSON.parse(res));

        var response = JSON.parse(res);
        var data = response.ResponseMessage.Item1;

        this.filterdata = data;

        var list = [];
        data.forEach((el) => {
          var picture = "";
          try {
            picture = el["Picture"].slice(1, -1)
          } catch(err) {
            picture = "";
          }
          var obj = {
            data: {
              ItemID: el["ItemID"],
              Picture: 'data:' + 'image/png' + ';base64,' + picture,
              ItemName: el["ItemName"],
              ItemQuantity: el["ItemQuantity"],
              ItemBuyPrice: el["ItemBuyPrice"],
              ItemPrice: el["ItemPrice"],
              ItemPriceTax: el["ItemPriceTax"],
              favoriteCategoryName: el["favoriteCategoryName"],
              FavoriteCategory: el["FavoriteCategory"],
              warehouseName: el["warehouseName"],
              ItemTypeName: el["ItemTypeName"],
              ItemBarCode: el["ItemBarCode"],
            },
          };
          list.push(obj);
        });

        this.data = list;

        console.log(this.dataSource);
      });
  }

  newinvoice() {
    this.itemlist = [];
    this.random = this.getRandomNumber(1, 1000000);
    this.random2 = this.getRandomNumber(1, 1000000);
    var totalAmount = 0;
    var billAmount = 0;
    var totalquantity = 0;
    var amount = [];

    if (this.paydata.length > 0) {
      this.paydata.forEach((el) => {
        var obj = {
          data: {
            ItemID: el.data.ItemID,
            Picture: el.data.Picture,
            ItemName: el.data.ItemName,
            ItemQuantity: el.data.ItemQuantity,
            ItemBuyPrice: el.data.ItemBuyPrice,
            ItemPrice: el.data.ItemPrice,
            ItemPriceTax: el.data.ItemPriceTax,
            favoriteCategoryName: el.data.favoriteCategoryName,
            FavoriteCategory: el.data.FavoriteCategory,
            warehouseName: el.data.warehouseName,
            ItemTypeName: el.data.ItemTypeName,
            ItemBarCode: el.data.ItemBarCode,
            RandomCode: this.random,
          }, randomcode: this.random2
        };
        this.PreviousPickedItem.push(obj);
      });

      this.paydata.forEach((el) => {
        var obj = {
          data: {
            ItemID: el.data.ItemID,
            Picture: el.data.Picture,
            ItemName: el.data.ItemName,
            ItemQuantity: el.data.ItemQuantity,
            ItemBuyPrice: el.data.ItemBuyPrice,
            ItemPrice: el.data.ItemPrice,
            ItemPriceTax: el.data.ItemPriceTax,
            favoriteCategoryName: el.data.favoriteCategoryName,
            FavoriteCategory: el.data.FavoriteCategory,
            warehouseName: el.data.warehouseName,
            ItemTypeName: el.data.ItemTypeName,
            ItemBarCode: el.data.ItemBarCode,
            RandomCode: this.random,
          }, randomcode: this.random2
        };
        this.codegenerate.push(obj);
      });
    } else {
      this.dataa.forEach((el) => {
        var obj = {
          data: {
            ItemID: el.data.ItemID,
            Picture: el.data.Picture,
            ItemName: el.data.ItemName,
            ItemQuantity: el.data.ItemQuantity,
            ItemBuyPrice: el.data.ItemBuyPrice,
            ItemPrice: el.data.ItemPrice,
            ItemPriceTax: el.data.ItemPriceTax,
            favoriteCategoryName: el.data.favoriteCategoryName,
            FavoriteCategory: el.data.FavoriteCategory,
            warehouseName: el.data.warehouseName,
            ItemTypeName: el.data.ItemTypeName,
            ItemBarCode: el.data.ItemBarCode,
            RandomCode: this.random,
          }, randomcode: this.random2
        };
        this.PreviousPickedItem.push(obj);
      });

      this.dataa.forEach((el) => {
        var obj = {
          data: {
            ItemID: el.data.ItemID,
            Picture: el.data.Picture,
            ItemName: el.data.ItemName,
            ItemQuantity: el.data.ItemQuantity,
            ItemBuyPrice: el.data.ItemBuyPrice,
            ItemPrice: el.data.ItemPrice,
            ItemPriceTax: el.data.ItemPriceTax,
            favoriteCategoryName: el.data.favoriteCategoryName,
            FavoriteCategory: el.data.FavoriteCategory,
            warehouseName: el.data.warehouseName,
            ItemTypeName: el.data.ItemTypeName,
            ItemBarCode: el.data.ItemBarCode,
            RandomCode: this.random,
          }, randomcode: this.random2
        };
        this.codegenerate.push(obj);
      });
    }
    this.PreviousPickedItem.forEach((el) => {
      var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
      billAmount += individualAmount;

      console.log(individualAmount);
    });
    amount.push(billAmount);
    this.perviousitem = this.PreviousPickedItem;

    this.PreviousPickedItem.forEach((el) => {
      var individualAmount = el.data.ItemQuantity;
      totalquantity += individualAmount;

      console.log(totalquantity);
    });

    this.billquantity = this.PreviousPickedItem.length;
    var obj = {
      data: {
        ItemName: this.billquantity,
        ItemQuantity: totalquantity,
        ItemPrice: billAmount,
        randomcode: this.PreviousPickedItem[0].data.RandomCode,
      }, randomcode: this.random2
    };

    this.pandingbill = this.allbills.push(obj);

    this.allbills.forEach((el) => {
      var individualAmount = el.data.ItemPrice;
      totalAmount += individualAmount;

      console.log(individualAmount);
    });
    amount.push(totalAmount);
    this.perivoustotal = totalAmount;

    this.currentSelectedBill = null;

    this.dataSource = this.dataSourceBuilder.create([]);
    this.pandingdata = [];
    this.paydata = [];
    this.dataa = [];
    this.PreviousPickedItem = [];
    this.itemlist = [];
  }

  update(Barcode) {
    if (this.paydata.length > 0) {
      var SelectedData = this.paydata.filter(
        (a) => a.data.ItemBarCode == Barcode
      )[0];
    } else {
      var SelectedData = this.dataa.filter(
        (a) => a.data.ItemBarCode == Barcode
      )[0];
    }

    var obj = {
      ItemQuantity: SelectedData.data.ItemQuantity,
      ItemBarCode: Barcode,
    };

    var data = this.windowService.open(UpdateQuantityComponent, {
      title: `Update Quantity`,
      context: obj,
    });

    data.onClose.subscribe((res) => {
      if (res) {
        var totalAmount = 0;
        var billAmount = 0;
        var totalquantity = 0;
        var amount = [];
        if (this.paydata.length > 0) {
          var selected;
          var selected2;
          var selected3;
          if (this.currentSelectedBill != null) {
            selected = this.paydata.findIndex((a) => a.data.ItemBarCode == Barcode && a.data.RandomCode == this.random && a.randomcode == this.random2);
            selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == Barcode && a.data.RandomCode == this.random && a.randomcode == this.random2);
            selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
          }
          else {
            selected = this.paydata.findIndex((a) => a.data.ItemBarCode == Barcode);
            selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == Barcode);
            selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
          }
          if (selected !== -1 && res.ItemQuantity !== 0) {
            if (selected !== -1) {
              this.paydata[selected].data.ItemQuantity = res.ItemQuantity;
            }
            if (selected2 !== -1) {
              this.codegenerate[selected2].data.ItemQuantity = res.ItemQuantity;
            }
            if (selected3 !== -1) {
              this.paydata.forEach((el) => {
                var obj = {
                  data: {
                    ItemID: el.data.ItemID,
                    Picture: el.data.Picture,
                    ItemName: el.data.ItemName,
                    ItemQuantity: el.data.ItemQuantity,
                    ItemBuyPrice: el.data.ItemBuyPrice,
                    ItemPrice: el.data.ItemPrice,
                    ItemPriceTax: el.data.ItemPriceTax,
                    favoriteCategoryName: el.data.favoriteCategoryName,
                    FavoriteCategory: el.data.FavoriteCategory,
                    warehouseName: el.data.warehouseName,
                    ItemTypeName: el.data.ItemTypeName,
                    ItemBarCode: el.data.ItemBarCode,
                    RandomCode: this.random,
                  }, randomcode: this.random2
                };
                this.PreviousPickedItem.push(obj);
              });

              this.PreviousPickedItem.forEach((el) => {
                var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
                billAmount += individualAmount;
          
                console.log(individualAmount);
              });
              amount.push(billAmount);
              this.perviousitem = this.PreviousPickedItem;
          
              this.PreviousPickedItem.forEach((el) => {
                var individualAmount = el.data.ItemQuantity;
                totalquantity += individualAmount;
          
                console.log(totalquantity);
              });
          
              this.billquantity = this.PreviousPickedItem.length;

              this.allbills[selected3].data.ItemName = this.billquantity;
              this.allbills[selected3].data.ItemQuantity = totalquantity;
              this.allbills[selected3].data.ItemPrice = billAmount;
          
              this.allbills.forEach((el) => {
                var individualAmount = el.data.ItemPrice;
                totalAmount += individualAmount;
          
                console.log(individualAmount);
              });
              amount.push(totalAmount);
          
              this.PreviousPickedItem = [];
              this.pandingdata = [];
            }
          }
          this.paydata.forEach((el) => {
            var obj = {
              ItemName: el.data.ItemName,
              ItemQuantity: el.data.ItemQuantity,
              ItemPrice: el.data.ItemPrice,
              RandomCode: el.data.RandomCode,
            };
            this.selectedfilter.push(obj);
          });
          this.dataSource = this.dataSourceBuilder.create(this.paydata);
        } else {
          var selected;
          var selected2;
          var selected3;
          if (this.currentSelectedBill != null) {
            selected = this.dataa.findIndex((a) => a.data.ItemBarCode == Barcode && a.data.RandomCode == this.random && a.randomcode == this.random2);
            selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == Barcode && a.data.RandomCode == this.random && a.randomcode == this.random2);
            selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
          }
          else {
            selected = this.dataa.findIndex((a) => a.data.ItemBarCode == Barcode);
            selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == Barcode);
            selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
          }
          if (selected !== -1 && res.ItemQuantity !== 0) {
            if (selected !== -1) {
              this.dataa[selected].data.ItemQuantity = res.ItemQuantity;
            }
            if (selected2 !== -1) {
              this.codegenerate[selected2].data.ItemQuantity = res.ItemQuantity;
            }
            if (selected3 !== -1) {
              this.dataa.forEach((el) => {
                var obj = {
                  data: {
                    ItemID: el.data.ItemID,
                    Picture: el.data.Picture,
                    ItemName: el.data.ItemName,
                    ItemQuantity: el.data.ItemQuantity,
                    ItemBuyPrice: el.data.ItemBuyPrice,
                    ItemPrice: el.data.ItemPrice,
                    ItemPriceTax: el.data.ItemPriceTax,
                    favoriteCategoryName: el.data.favoriteCategoryName,
                    FavoriteCategory: el.data.FavoriteCategory,
                    warehouseName: el.data.warehouseName,
                    ItemTypeName: el.data.ItemTypeName,
                    ItemBarCode: el.data.ItemBarCode,
                    RandomCode: this.random,
                  }, randomcode: this.random2
                };
                this.PreviousPickedItem.push(obj);
              });

              this.PreviousPickedItem.forEach((el) => {
                var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
                billAmount += individualAmount;
          
                console.log(individualAmount);
              });
              amount.push(billAmount);
              this.perviousitem = this.PreviousPickedItem;
          
              this.PreviousPickedItem.forEach((el) => {
                var individualAmount = el.data.ItemQuantity;
                totalquantity += individualAmount;
          
                console.log(totalquantity);
              });
          
              this.billquantity = this.PreviousPickedItem.length;

              this.allbills[selected3].data.ItemName = this.billquantity;
              this.allbills[selected3].data.ItemQuantity = totalquantity;
              this.allbills[selected3].data.ItemPrice = billAmount;
          
              this.allbills.forEach((el) => {
                var individualAmount = el.data.ItemPrice;
                totalAmount += individualAmount;
          
                console.log(individualAmount);
              });
              amount.push(totalAmount);
          
              this.PreviousPickedItem = [];
              this.pandingdata = [];
            }
          }

          this.dataa.forEach((el) => {
            var obj = {
              ItemName: el.data.ItemName,
              ItemQuantity: el.data.ItemQuantity,
              ItemPrice: el.data.ItemPrice,
            };
            this.selectedfilter.push(obj);
          });
          this.dataSource = this.dataSourceBuilder.create(this.dataa);
        }
      }
      this.ScannedBarcode = '';
    });
  }

  updatebill() {
    var totalAmount = 0;
    var amount = [];

    if (this.paydata.length > 0) {
      this.paydata.forEach((el) => {
        var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
        totalAmount += individualAmount;

        console.log(individualAmount);
      });
      amount.push(totalAmount);

      if (this.deleteitem.length > 0) {
        var obj = {
          AmountRequired: totalAmount,
          itemlist: this.paydataa,
        };
      } else {
        var obj = {
          AmountRequired: totalAmount,
          itemlist: this.paydataa,
        };
      }
    } else {
      this.dataa.forEach((el) => {
        var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
        totalAmount += individualAmount;

        console.log(individualAmount);
      });

      amount.push(totalAmount);
      if (this.deleteitem.length > 0) {
        var obj = {
          AmountRequired: totalAmount,
          itemlist: this.selectedfilter,
        };
      } else {
        var obj = {
          AmountRequired: totalAmount,
          itemlist: this.itemlist,
        };
      }
    }

    var dt = this.windowService.open(PaymentModalComponent, {
      title: `Payment`,
      context: obj,
    });

    dt.componentInstance.modalClose.subscribe((res) => {
      console.log("current selected bill")
      console.log(this.currentSelectedBill)
        
      this.allbills = this.allbills.filter(item => item.randomcode !== this.currentSelectedBill.randomcode);
      console.log("all bills new")
      console.log(this.allbills)
      this.codegenerate = this.codegenerate.filter(item => item.randomcode !== this.currentSelectedBill.randomcode);
      console.log("codegenerate new")
      console.log(this.codegenerate)

      this.pandingbill = this.allbills.length;

      this.paydata = [];
      this.paydataa = [];
      this.dataa = [];
      this.itemlist = [];
      this.selectedfilter = [];

      this.dataSource = this.dataSourceBuilder.create([]);
      this.ngOnInit();
      this.ScannedBarcode = '';
    });

    dt.onClose.subscribe((res) => {
      var amount = this.allbills.filter(
        (a) => a.data.randomcode == res.randomcode
      );
      this.total = this.perivoustotal - amount[0].data.ItemPrice;
      this.perivoustotal = this.total;
    });
  }

  Perivousbill() {
    var data = this.windowService.open(PerivousBillComponent, {
      title: `Pick Bill`,
      context: this.allbills,
    });

    data.onClose.subscribe((res) => {
      if (res) {
        var selected = this.codegenerate.filter(
          (a) => a.data.RandomCode == res
        );
        this.filtercode = res;

        if (this.filtercode > 0) {
          this.dataSource = this.dataSourceBuilder.create([]);
          this.filtercode = 0;
          this.paydata = [];
          this.paydataa = [];
          this.dataa = [];
          this.itemlist = [];
          this.selectedfilter = [];
        }

        this.currentSelectedBill = selected
        this.currentSelectedBill.randomcode = selected[0].randomcode

        console.log("selected")
        console.log(this.currentSelectedBill)
        console.log("all bills")
        console.log(this.allbills)
        console.log("codegenerate")
        console.log(this.codegenerate)

        selected.forEach((el) => {
          var obj = {
            data: {
              ItemID: el.data.ItemID,
              Picture: el.data.Picture,
              ItemName: el.data.ItemName,
              ItemQuantity: el.data.ItemQuantity,
              ItemBuyPrice: el.data.ItemBuyPrice,
              ItemPrice: el.data.ItemPrice,
              ItemPriceTax: el.data.ItemPriceTax,
              favoriteCategoryName: el.data.favoriteCategoryName,
              FavoriteCategory: el.data.FavoriteCategory,
              warehouseName: el.data.warehouseName,
              ItemTypeName: el.data.ItemTypeName,
              ItemBarCode: el.data.ItemBarCode,
              RandomCode: el.data.RandomCode,
            }, randomcode: el.randomcode,
          };

          this.random = obj.data.RandomCode
          this.random2 = obj.randomcode

          this.paydata.push(obj);
          this.paydataa.push(obj.data);
          this.dataSource = this.dataSourceBuilder.create(this.paydata);
        });
        this.dataa = [];
        this.itemlist = [];
        this.selectedfilter = [];
      }
    });
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  PickItem() {
    var data = this.windowService.open(PickItemModalComponent, {
      title: `Pick Item`,
    });

    data.onClose.subscribe((res) => {
      if (res) {
        var totalAmount = 0;
        var billAmount = 0;
        var totalquantity = 0;
        var amount = [];

        var selected = this.data.filter((a) => a.data.ItemBarCode == res);

        var newItem = {
          data: {
            ItemID: selected[0].data.ItemID,
            Picture: selected[0].data.Picture,
            ItemName: selected[0].data.ItemName,
            ItemQuantity: 1,
            ItemBuyPrice: selected[0].data.ItemBuyPrice,
            ItemPrice: selected[0].data.ItemPrice,
            ItemPriceTax: selected[0].data.ItemPriceTax,
            favoriteCategoryName: selected[0].data.favoriteCategoryName,
            FavoriteCategory: selected[0].data.FavoriteCategory,
            warehouseName: selected[0].data.warehouseName,
            ItemTypeName: selected[0].data.ItemTypeName,
            ItemBarCode: selected[0].data.ItemBarCode,
          },
        };

        if (this.paydata.length > 0) {
          var selected = null;
          var selected2 = null;
          var selected3 = null;
          if (this.currentSelectedBill != null) {
            console.log("B1")
            selected = this.paydata.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
            selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
            selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
          }
          else {
            console.log("B2")
            selected = this.paydata.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
            selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
            selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
          }

          var barcode = this.paydata.filter((a) => a.data.ItemBarCode == res);
          debugger;
          if (barcode.length > 0) {
            this.toastrService.danger("This item Is already exist", "Try another item");

          } else {
            this.paydata.push(newItem);
            this.paydataa.push(newItem.data);
            this.pandingdata = this.paydataa;
            this.dataSource = this.dataSourceBuilder.create(this.paydata);
            this.dataa = [];
            this.itemlist = [];
          }
          if (selected3 !== -1) {
            if (this.paydata.length == 0) {
              this.allbills.splice(selected3, 1);
            }
            this.paydata.forEach((el) => {
              var obj = {
                data: {
                  ItemID: el.data.ItemID,
                  Picture: el.data.Picture,
                  ItemName: el.data.ItemName,
                  ItemQuantity: el.data.ItemQuantity,
                  ItemBuyPrice: el.data.ItemBuyPrice,
                  ItemPrice: el.data.ItemPrice,
                  ItemPriceTax: el.data.ItemPriceTax,
                  favoriteCategoryName: el.data.favoriteCategoryName,
                  FavoriteCategory: el.data.FavoriteCategory,
                  warehouseName: el.data.warehouseName,
                  ItemTypeName: el.data.ItemTypeName,
                  ItemBarCode: el.data.ItemBarCode,
                  RandomCode: this.random,
                }, randomcode: this.random2
              };
              this.PreviousPickedItem.push(obj);
            });
    
            this.PreviousPickedItem.forEach((el) => {
              var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
              billAmount += individualAmount;
        
              console.log(individualAmount);
            });
            amount.push(billAmount);
            this.perviousitem = this.PreviousPickedItem;
        
            this.PreviousPickedItem.forEach((el) => {
              var individualAmount = el.data.ItemQuantity;
              totalquantity += individualAmount;
        
              console.log(totalquantity);
            });
        
            this.billquantity = this.PreviousPickedItem.length;
    
            this.allbills[selected3].data.ItemName = this.billquantity;
            this.allbills[selected3].data.ItemQuantity = totalquantity;
            this.allbills[selected3].data.ItemPrice = billAmount;
        
            //this.pandingbill = this.allbills.push(obj);
        
            this.allbills.forEach((el) => {
              var individualAmount = el.data.ItemPrice;
              totalAmount += individualAmount;
        
              console.log(individualAmount);
            });
            amount.push(totalAmount);
        
            this.PreviousPickedItem = [];
            this.pandingdata = [];
          }
        } else {
          var selected = null;
          var selected2 = null;
          var selected3 = null;
          if (this.currentSelectedBill != null) {
            console.log("B1")
            selected = this.paydata.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
            selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode && a.data.RandomCode == this.random && a.randomcode == this.random2);
            selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
          }
          else {
            console.log("B2")
            selected = this.paydata.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
            selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == newItem.data.ItemBarCode);
            selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
          }

          var barcode = this.dataa.filter((a) => a.data.ItemBarCode == res);
          debugger;
          if (barcode.length > 0) {
            this.toastrService.danger("This item Is already exist", "Try another item");
          } else {
            this.dataa.push(newItem);
            this.itemlist.push(newItem.data);
            this.pandingdata = this.itemlist;
            this.dataSource = this.dataSourceBuilder.create(this.dataa);
            this.paydata = [];
            this.paydataa = [];
          }

          if (selected3 !== -1) {
            if (this.dataa.length == 0) {
              this.allbills.splice(selected3, 1);
            }
            this.dataa.forEach((el) => {
              var obj = {
                data: {
                  ItemID: el.data.ItemID,
                  Picture: el.data.Picture,
                  ItemName: el.data.ItemName,
                  ItemQuantity: el.data.ItemQuantity,
                  ItemBuyPrice: el.data.ItemBuyPrice,
                  ItemPrice: el.data.ItemPrice,
                  ItemPriceTax: el.data.ItemPriceTax,
                  favoriteCategoryName: el.data.favoriteCategoryName,
                  FavoriteCategory: el.data.FavoriteCategory,
                  warehouseName: el.data.warehouseName,
                  ItemTypeName: el.data.ItemTypeName,
                  ItemBarCode: el.data.ItemBarCode,
                  RandomCode: this.random,
                }, randomcode: this.random2
              };
              this.PreviousPickedItem.push(obj);
            });
    
            this.PreviousPickedItem.forEach((el) => {
              var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
              billAmount += individualAmount;
        
              console.log(individualAmount);
            });
            amount.push(billAmount);
            this.perviousitem = this.PreviousPickedItem;
        
            this.PreviousPickedItem.forEach((el) => {
              var individualAmount = el.data.ItemQuantity;
              totalquantity += individualAmount;
        
              console.log(totalquantity);
            });
        
            this.billquantity = this.PreviousPickedItem.length;
    
            this.allbills[selected3].data.ItemName = this.billquantity;
            this.allbills[selected3].data.ItemQuantity = totalquantity;
            this.allbills[selected3].data.ItemPrice = billAmount;
        
            //this.pandingbill = this.allbills.push(obj);
        
            this.allbills.forEach((el) => {
              var individualAmount = el.data.ItemPrice;
              totalAmount += individualAmount;
        
              console.log(individualAmount);
            });
            amount.push(totalAmount);
        
            this.PreviousPickedItem = [];
            this.pandingdata = [];
          }
        }
      }
    });
  }

  Delete(id) {
    ;

    var totalAmount = 0;
    var billAmount = 0;
    var totalquantity = 0;
    var amount = [];

    if (this.paydata.length > 0) {
      var selected = null;
      var selected2 = null;
      var selected3 = null;
      if (this.currentSelectedBill != null) {
        console.log("B1")
        console.log("id")
        console.log(id)
        console.log("paydata q")
        console.log(this.paydata)
        selected = this.paydata.findIndex((a) => a.randomcode == this.random2);
        selected2 = this.codegenerate.findIndex((a) => a.randomcode == this.random2);
        selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
      }
      else {
        console.log("B2")
        selected = this.paydata.findIndex((a) => a.data.ItemBarCode == id);
        selected2 = this.codegenerate.findIndex((a) => a.data.ItemBarCode == id);
        selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
      }
      console.log("selected")
      console.log(selected)
      if (selected !== -1) {
        console.log("paydata")
        console.log(this.paydata)
        this.paydata.splice(selected, 1);
        if (this.paydata.length == 0) {
          if (selected2 !== -1) {
            this.codegenerate.splice(selected2, 1);
          }
        }

        this.paydata.forEach((el) => {
          var obj = {
            data: {
              Picture: el.data.Picture,
              ItemName: el.data.ItemName,
              ItemBarCode: el.data.ItemBarCode,
              ItemQuantity: el.data.ItemQuantity,
              ItemPrice: el.data.ItemPrice,
            },
          };
          this.secoundDeleteTable.push(obj);
          this.deleteitem.push(obj.data);
        });
        this.dataSource = this.dataSourceBuilder.create(
          this.paydata
        );
      }
      console.log("selected 3 1")
      console.log(selected3)
      if (selected3 !== -1) {
        if (this.paydata.length == 0) {
          this.allbills.splice(selected3, 1);
        }
        this.paydata.forEach((el) => {
          var obj = {
            data: {
              ItemID: el.data.ItemID,
              Picture: el.data.Picture,
              ItemName: el.data.ItemName,
              ItemQuantity: el.data.ItemQuantity,
              ItemBuyPrice: el.data.ItemBuyPrice,
              ItemPrice: el.data.ItemPrice,
              ItemPriceTax: el.data.ItemPriceTax,
              favoriteCategoryName: el.data.favoriteCategoryName,
              FavoriteCategory: el.data.FavoriteCategory,
              warehouseName: el.data.warehouseName,
              ItemTypeName: el.data.ItemTypeName,
              ItemBarCode: el.data.ItemBarCode,
              RandomCode: this.random,
            }, randomcode: this.random2
          };
          this.PreviousPickedItem.push(obj);
        });

        this.PreviousPickedItem.forEach((el) => {
          var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
          billAmount += individualAmount;
    
          console.log(individualAmount);
        });
        amount.push(billAmount);
        this.perviousitem = this.PreviousPickedItem;
    
        this.PreviousPickedItem.forEach((el) => {
          var individualAmount = el.data.ItemQuantity;
          totalquantity += individualAmount;
    
          console.log(totalquantity);
        });
    
        this.billquantity = this.PreviousPickedItem.length;

        this.allbills[selected3].data.ItemName = this.billquantity;
        this.allbills[selected3].data.ItemQuantity = totalquantity;
        this.allbills[selected3].data.ItemPrice = billAmount;
    
        //this.pandingbill = this.allbills.push(obj);
    
        this.allbills.forEach((el) => {
          var individualAmount = el.data.ItemPrice;
          totalAmount += individualAmount;
    
          console.log(individualAmount);
        });
        amount.push(totalAmount);
    
        this.PreviousPickedItem = [];
        this.pandingdata = [];
      }
    }

    if (this.dataa.length > 0) {
      var selected = null;
      var selected2 = null;
      var selected3 = null;
      if (this.currentSelectedBill != null) {
        console.log("C1")
        selected = this.dataa.findIndex((a) => a.randomcode == this.random2);
        selected2 = this.codegenerate.findIndex((a) => a.randomcode == this.random2);
        selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
      }
      else {
        console.log("C2")
        selected = this.dataa.findIndex((a) => a.randomcode == this.random2);
        selected2 = this.codegenerate.findIndex((a) => a.randomcode == this.random2);
        selected3 = this.allbills.findIndex((a) => a.randomcode == this.random2);
      }
      console.log("selected")
      console.log(selected)
      if (selected !== -1) {
        console.log("dataa")
        console.log(this.dataa)
        this.dataa.splice(selected, 1);
        if (this.dataa.length == 0) {
          if (selected2 !== -1) {
            this.codegenerate.splice(selected2, 1);
          }
        }

        this.dataa.forEach((el) => {
          var obj = {
            data: {
              Picture: el.data.Picture,
              ItemName: el.data.ItemName,
              ItemBarCode: el.data.ItemBarCode,
              ItemQuantity: el.data.ItemQuantity,
              ItemPrice: el.data.ItemPrice,
            },
          };
          this.secoundDeleteTable.push(obj);
          this.deleteitem.push(obj.data);
        });
        this.dataSource = this.dataSourceBuilder.create(
          this.dataa
        );
      }
      console.log("selected 3 2")
      console.log(selected3)
      if (selected3 !== -1) {
        if (this.dataa.length == 0) {
          this.allbills.splice(selected3, 1);
        }
        this.dataa.forEach((el) => {
          var obj = {
            data: {
              ItemID: el.data.ItemID,
              Picture: el.data.Picture,
              ItemName: el.data.ItemName,
              ItemQuantity: el.data.ItemQuantity,
              ItemBuyPrice: el.data.ItemBuyPrice,
              ItemPrice: el.data.ItemPrice,
              ItemPriceTax: el.data.ItemPriceTax,
              favoriteCategoryName: el.data.favoriteCategoryName,
              FavoriteCategory: el.data.FavoriteCategory,
              warehouseName: el.data.warehouseName,
              ItemTypeName: el.data.ItemTypeName,
              ItemBarCode: el.data.ItemBarCode,
              RandomCode: this.random,
            }, randomcode: this.random2
          };
          this.PreviousPickedItem.push(obj);
        });

        this.PreviousPickedItem.forEach((el) => {
          var individualAmount = el.data.ItemQuantity * el.data.ItemPrice;
          billAmount += individualAmount;
    
          console.log(individualAmount);
        });
        amount.push(billAmount);
        this.perviousitem = this.PreviousPickedItem;
    
        this.PreviousPickedItem.forEach((el) => {
          var individualAmount = el.data.ItemQuantity;
          totalquantity += individualAmount;
    
          console.log(totalquantity);
        });
    
        this.billquantity = this.PreviousPickedItem.length;

        this.allbills[selected3].data.ItemName = this.billquantity;
        this.allbills[selected3].data.ItemQuantity = totalquantity;
        this.allbills[selected3].data.ItemPrice = billAmount;
    
        //this.pandingbill = this.allbills.push(obj);
    
        this.allbills.forEach((el) => {
          var individualAmount = el.data.ItemPrice;
          totalAmount += individualAmount;
    
          console.log(individualAmount);
        });
        amount.push(totalAmount);
    
        this.PreviousPickedItem = [];
        this.pandingdata = [];
      }
    }
  }
}

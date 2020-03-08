
/**********************************************************
 // create Vue component
 **********************************************************/
var vueInstance = new Vue({
  el: '#tableContent',
  data() {
    return {
      rawTableSum:{
        sessionSum: null,
        transactionSum: null,
        revenueSum: null,
        conversionAvg: null
      },
      rawTableData: [
        {
          source: 'direct',
          medium: 'none',
          session: 10000,
          conversion: 0.100,
          transaction: 1000,
          revenue: 10000,
        },
        {
          source: 'omnichat',
          medium: 'fb',
          session: 5000,
          conversion: 0.080,
          transaction: 400,
          revenue: 400,
        },
        {
          source: 'google',
          medium: 'cpc',
          session: 8000,
          conversion: 0.125,
          transaction: 1000,
          revenue: 1000,
        },
        {
          source: 'omnichat',
          medium: 'webchat',
          session: 3000,
          conversion: 0.267,
          transaction: 800,
          revenue: 800,
        },
        {
          source: 'direct',
          medium: 'none',
          session: 10000,
          conversion: 0.100,
          transaction: 1000,
          revenue: 10000,
        },
        {
          source: 'omnichat',
          medium: 'fb',
          session: 5000,
          conversion: 0.080,
          transaction: 400,
          revenue: 400,
        },
        {
          source: 'google',
          medium: 'cpc',
          session: 8000,
          conversion: 0.125,
          transaction: 1000,
          revenue: 1000,
        },
        {
          source: 'omnichat',
          medium: 'webchat',
          session: 3000,
          conversion: 0.267,
          transaction: 800,
          revenue: 800,
        },
        {
          source: 'direct',
          medium: 'none',
          session: 10000,
          conversion: 0.100,
          transaction: 1000,
          revenue: 10000,
        },
        {
          source: 'omnichat',
          medium: 'fb',
          session: 5000,
          conversion: 0.080,
          transaction: 400,
          revenue: 400,
        },
        {
          source: 'google',
          medium: 'cpc',
          session: 8000,
          conversion: 0.125,
          transaction: 1000,
          revenue: 1000,
        },
        {
          source: 'omnichat',
          medium: 'webchat',
          session: 3000,
          conversion: 0.267,
          transaction: 800,
          revenue: 800,
        },
      ],
      searchTableSum:{},
      searchTableData:[],
      displayTableSum:{},
      displayTableData:[],
      // funnelTrafficSourceDate: {
      //   start: moment().subtract(14, 'd').startOf('day').unix() * 1000,
      //   end: moment().add(1, 'd').startOf('day').unix() * 1000
      // }
      isSortDescending: true,
      sortHeader: 'revenue',
      searchInput: '',
      searchCount: 0,
      startIndex: 0, 
      endIndex: 0,
      startPage: 1,

      pageSize: 0,
      totalPages: 0,
      // maxPages: 3,
      currentPage: 1, 
      pages: []
      
    }
  },
  mounted () {
  },
  created() {
    this.initTableDisplay();
    this.updatePagination();
    // this.initTrafficSourceFlatpickr();
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },
    assignRowNumber(data){
      Object.keys(data).forEach(key => Object.assign(data[key], { "index": Number(key) }))
    },
    dynamicSort(key) {
      this.isSortDescending ? sortOrder = -1 : sortOrder = 1;

      return function (a, b){
        // a before b in the sorted order
        if (a[key] < b[key]) return -1 * sortOrder; 
        // a after b in the sorted order
        else if (a[key] > b[key]) return 1 * sortOrder;
        // a and b are the same
        else return 0 * sortOrder;
      }
    },
    calculateRawTableSum() {
      let sessionSum = this.rawTableData.reduce((total, item) => total + item.session, 0);
      this.rawTableSum.sessionSum = sessionSum;

      let transactionSum  = this.rawTableData.reduce((total, item) => total + item.transaction, 0);
      this.rawTableSum.transactionSum = transactionSum;
      
      let revenueSum = this.rawTableData.reduce((total, item) => total + item.revenue, 0);
      this.rawTableSum.revenueSum = revenueSum;

      let conversionAvg = transactionSum / sessionSum
      this.rawTableSum.conversionAvg = conversionAvg;

      this.rawTableData.sort(this.dynamicSort(this.sortHeader))
    },
    initTableDisplay() {
      this.calculateRawTableSum();
      this.assignRowNumber(this.rawTableData);
      this.searchTableSum = JSON.parse(JSON.stringify(this.rawTableSum));
      this.searchTableData = JSON.parse(JSON.stringify(this.rawTableData));
      this.searchCount = this.rawTableData.length;

      this.countTotalPages();
      
      this.displayTableSum = JSON.parse(JSON.stringify(this.searchTableSum));
      this.displayTableData = JSON.parse(JSON.stringify(this.searchTableData)).slice(this.startIndex, this.startIndex+this.pageSize);
    },
    sortDisplay(key) {
      this.searchTableData.sort(this.dynamicSort(key))
      this.assignRowNumber(this.searchTableData);
      this.isSortDescending = !this.isSortDescending; 
      // todo: 嚷我想想這邊要 deep copy 還是 copy reference 就好了
      // this.displayTableData = JSON.parse(JSON.stringify(this.searchTableData));
      this.sortHeader = key;
      // this.updateTableDisplay();
      this.displayTableData = this.searchTableData.slice(0, this.pageSize);
    },
    updateSearchResult() {
      // filter search data
      let searchResult = this.rawTableData.filter(item => item.source.includes(this.searchInput) || item.medium.includes(this.searchInput));
      this.searchCount = searchResult.length;
      this.searchTableData = searchResult;
      // // todo: need to add pagination for display data
      // this.displayTableData = this.searchTableData;

      this.assignRowNumber(this.searchTableData);

      // calculate search sum
      let sessionSum = this.searchTableData.reduce((total, item) => total + item.session, 0);
      this.searchTableSum.sessionSum = sessionSum;

      let transactionSum  = this.searchTableData.reduce((total, item) => total + item.transaction, 0);
      this.searchTableSum.transactionSum = transactionSum;
      
      let revenueSum = this.searchTableData.reduce((total, item) => total + item.revenue, 0);
      this.searchTableSum.revenueSum = revenueSum;

      let conversionAvg = transactionSum / sessionSum
      this.searchTableSum.conversionAvg = conversionAvg;

      this.countTotalPages();
      // this.updatePagination();
      this.updateDisplayIndex();
      this.createPageList();
      // this.updateTableDisplay();
      this.displayTableData = this.searchTableData.slice(0, this.pageSize);
    },
    updateTableDisplay() {
      this.updatePagination();
      this.displayTableData = this.searchTableData.slice(this.startIndex, this.endIndex+1);
    },
    changePageSize(event) {
      this.pageSize = event.target.value;
      this.countTotalPages();
      // this.updatePagination();
      this.updateDisplayIndex();
      this.createPageList();


      this.displayTableData = this.searchTableData.slice(0, this.pageSize);
      // this.updateTableDisplay();
    },
    countTotalPages() {
      this.pageSize = Number(document.querySelector('#page-size').value);
      this.totalPages = Math.ceil(this.searchCount / this.pageSize);

      // crystal think below: ensure current page isn't out of range
      if (this.currentPage < 1) {
        this.currentPage = 1;
      } else if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      };
    },
    clickPageNumber(event) {
      if (this.totalPages > 1) {
        this.currentPage = Number(event.target.getAttribute('value'))
        // this.updateTableDisplay();
        this.updatePagination();
        this.displayTableData = this.searchTableData.slice(this.startIndex, this.endIndex+1);
      }
    },
    updatePagination(){
      this.updateDisplayIndex();
      this.createPageList();
    },
    updateDisplayIndex() {
      // calculate start and end item indexes
      this.startIndex = (this.currentPage - 1) * this.pageSize;
      this.endIndex = Math.min(this.startIndex + this.pageSize - 1, this.searchCount - 1);
    },
    createPageList() {
      
      this.pages = Array.from(Array((this.totalPages + 1) - this.startPage).keys()).map(i => this.startPage + i);
    },
  }
})

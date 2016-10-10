function getMonthTreeData(){
    var allMonths = getAllMonths();
    return _.map(allMonths, function(month){
        return {text: month};
    })
}

function createMonthTree(){
    var data = getMonthTreeData();
    var treeMonth = $('#treeMonth');
    treeMonth.treeview({
        levels: 1,
        data: data,
        showIcon: false,
        multiSelect: true,
        onNodeSelected: function(evt, node){
            filterDataToSelection();
        },
        onNodeUnselected: function(evt, node){
            filterDataToSelection();
        }
    });
}

function filterDataToSelection(){
    var data = bernmobilOriginalData;
    data = filterDataToSelectedMonths(data);
    data = filterDataToSelectedCategories(data);

    bernmobilDataByCourse = prepareDataByCourse(data);
    attachBernmobilDataToRoutes(bernmobilDataByCourse, routes);
    drawMap();
}

function filterDataToSelectedMonths(unfilteredData){
    var treeMonth = $('#treeMonth');
    var selectedNodes = treeMonth.treeview('getSelected');
    var filteredData = unfilteredData;
    if(selectedNodes.length != 0){
        var selectedMonths = _.map(selectedNodes, function(node){
            return node.text;
        });
        filteredData = filterDataByMonths(unfilteredData, selectedMonths);
    }
    return filteredData;
}

function getCategoryTreeData(){
    var categories = getEventCategories();

    return _.map(categories, function(category){
        return {text: category};
    })
}

function createCategoryTree(){
    var data = getCategoryTreeData();
    var treeCategory = $('#treeCategory');
    treeCategory.treeview({
        levels: 1,
        data: data,
        showIcon: false,
        multiSelect: true,
        onNodeSelected: function(evt, node){
            filterDataToSelection();
        },
        onNodeUnselected: function(evt, node){
            filterDataToSelection();
        }
    });
}

function filterDataToSelectedCategories(unfilteredData){
    var treeCategory = $('#treeCategory');
    var selectedNodes = treeCategory.treeview('getSelected');
    var filteredData = unfilteredData;
    if(selectedNodes.length != 0){
        var selectedCategories = _.map(selectedNodes, function(node){
            return node.text;
        });
        filteredData = filterDataByCategories(unfilteredData, selectedCategories);
    }
   return filteredData;
}
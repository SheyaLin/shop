 //控制层 
app.controller('goodsController' ,function($scope,$controller,goodsService,itemCatService,uploadService,typeTemplateService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.goods.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			
			//获取富文本编辑器数据
			$scope.entity.goodsDesc.introduction = editor.html();
			//保存
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//清空对象
					$scope.entity = {};
					//清空富文本编辑器
					editor.html('');
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	};
	
	//定义查询节点方法
	//先查询顶级节点,默认父id=0
	//查询一级节点
	$scope.findItemCat1List  = function(){
		//调用服务方法
		itemCatService.findItemCatByParentId(0).success(function(data){
			
			//赋值
			$scope.itemCat1List = data;
			
		});
	};
	
	//查询二级级联节点
	//$watch: 监控属性值变化,从而查询二级节点
	$scope.$watch('entity.goods.category1Id',function(newValue,oldValue){
		//使用新变化的值查询子节点
		//newValue就是分类id
		//调用服务方法
		itemCatService.findItemCatByParentId(newValue).success(function(data){
			
			//赋值
			$scope.itemCat2List = data;
			
		});
	});
	
	//查询三级级联节点
	//$watch: 监控属性值变化,从而查询二级节点
	$scope.$watch('entity.goods.category2Id',function(newValue,oldValue){
		//使用新变化的值查询子节点
		//newValue就是分类id
		//调用服务方法
		itemCatService.findItemCatByParentId(newValue).success(function(data){
			
			//赋值
			$scope.itemCat3List = data;
			
		});
	});
	
	
	//监控第三级节点,查询模版id
	//$watch: 监控属性值变化
	$scope.$watch('entity.goods.category3Id',function(newValue,oldValue){
		//使用新变化的值查询子节点
		//newValue就是分类id
		//调用服务方法
		itemCatService.findOne(newValue).success(function(data){
			$scope.entity.goods.typeTemplateId = data.typeId;
		});
	});
	

	//监控模板id值得变化
	$scope.$watch('entity.goods.typeTemplateId',function(newValue,oldValue){
		typeTemplateService.findOne(newValue).success(function(data){
			//绑定模板对象
			$scope.typeTemplate=data;
			//获取模板品牌数据
			$scope.typeTemplate.brandIds=JSON.parse($scope.typeTemplate.brandIds);
			// 获取模版中扩展属性
			$scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems);
		});
		
		// 查询模版中存储关键规格属性对应规格选项
		// 调用模版服务方法
		typeTemplateService.findSpecOptionListByTypeId(newValue).success(
				function(data) {
					$scope.specList = data;
				});
	})
	
	//文件上传
   $scope.uploadFile=function(){
		uploadService.uploadFile().success(function(data){
			if(data.success){
				$scope.imageEntity.url=data.message;
			}
			else{
				alert("上传失败");
			}
		})
		
	}
   //定义初始化对象
   $scope.entity={goods:{},goodsDesc:{itemImages : [],
		specificationItems : []}};
   
   //保存图片操作
   $scope.add_image_entity=function(){
	   //把图片对象数据添加到商品描述中
	   $scope.entity.goodsDesc.itemImages.push($scope.imageEntity);
   }
   
   //删除图片对象
   $scope.remove=function(index){
	   $scope.entity.goodsDesc.itemImages.splice(index,1);
   }
   
   
    
});	

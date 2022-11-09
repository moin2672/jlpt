const Content = require('../models/content');

isNumeric = (num) => {
    return !isNaN(num);
}
padLeft = (nr, n, str) => {
    return Array(n - String(nr).length + 1).join(str || "0") + nr;
}


exports.createContent=(req, res, next) =>{

    const content=new Content({
        japanese: req.body.japanese,
        eMeaning: req.body.eMeaning,
        ePronunciation: req.body.ePronunciation,
        tMeaning: req.body.tMeaning,
        tPronunciation: req.body.tPronunciation,
        lessonName: req.body.lessonName,
        lastUpdatedDate: req.body.lastUpdatedDate,
        creator:req.userData.userId
    });
    console.log("content=", content)
    content.save().then(createdContent=>{
        console.log("content added success")
        console.log(createdContent._id)
        res.status(201).json({
            message:"Content added successfully!",
            contentId: createdContent._id
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({message:'Creating a Content failed!'})
    });

    
}

exports.updateContent=(req, res, next)=>{
    const content = new Content({
        _id:req.body._id,
        japanese: req.body.japanese,
        eMeaning: req.body.eMeaning,
        ePronunciation: req.body.ePronunciation,
        tMeaning: req.body.tMeaning,
        tPronunciation: req.body.tPronunciation,
        lessonName: req.body.lessonName,
        lastUpdatedDate: req.body.lastUpdatedDate,
        creator:req.userData.userId
    })
    Content.updateOne({_id:req.params.id,creator: req.userData.userId}, content)
        .then(result=>{
            console.log("updateContent")
            console.log(result)
            if(result.matchedCount>0){
                res.status(200).json({message:"Content updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Updating a Content failed!'})
        });
}

exports.getContents=(req, res, next)=>{
    
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const contentQuery=Content.find();
    let fetchedContents;
    if(pageSize && currentPage){
        contentQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    contentQuery
        .then(documents=>{
            fetchedContents=documents;
            return Content.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Content fetched successfully", 
                contents:fetchedContents,
                maxContents:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Contents failed!'})
        });
}

exports.getContent=(req, res, next)=>{
    Content.findById(req.params.id)
        .then(content=>{
            if(content){ 
                res.status(200).json({content:content})
            }else{
                res.status(404).json({message:"Content not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Content failed!'})
        });
}

exports.deleteContent=(req, res, next)=>{
    Content.deleteOne({_id:req.params.id, creator: req.userData.userId})
    .then(result=>{
        // console.log("onDelete")
        // console.log(result);
        if(result.deletedCount>0){
            res.status(200).json({message:"Content Deleted successfully!"});
        }else{
            res.status(401).json({message:"Not Authorized"})
        }
    })
    .catch(error=>{
        res.status(500).json({message:'Deleting the Content failed!'})
    });
}



exports.searchContent = (req, res, next)=>{

    console.log(req.query)

    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const searchText= req.query.searchtext;
    
console.log(req.query);
console.log(searchText)
        
    let contentQuery=Content.find();
    let fetchedContents;
    
    
    if(searchText){
        console.log("inside")
        console.log(searchText)
        if(searchText!=""){
        var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
        const CheckValue =new RegExp(regexValue,'i');
       
        contentQuery=Content.find({$or:[{'japanese':CheckValue},{'eMeaning':CheckValue},{'ePronunciation':CheckValue},{'tMeaning':CheckValue},{'tPronunciation':CheckValue},{'lessonName':CheckValue}]});
        }     
    }

    
    contentQuery
    .then(contents=>{
        contentsCount=contents.length;
       console.log("inside contents - Count")
       // console.log(contentsCount)
        if(pageSize && currentPage){
            contentQuery
                .skip(pageSize*(currentPage-1))
                .limit(pageSize)
                // console.log("inside pagination")
        }
        contentQuery.clone()
            .then(contents=>{
                fetchedContents=contents;
                // console.log("inside contents")
                //console.log(contents.length)
                //console.log(fetchedContents.length)
               
            })
            .then(count=>{
                console.log("inside count")
                // console.log(count)
                // FOR DUMMY USE 'COUNT = '
                if(searchText!="" || typeof(searchText)!="undefined" ){
                    count= fetchedContents.length;
                    // console.log(count)
                }
                // console.log("contentsCount=",contentsCount)
                // console.log("count=",count)
                res.status(200).json({
                    message:"Filtered Contents fetched successfully", 
                    contents:fetchedContents,
                    maxContents:contentsCount
                });
            })
            .catch((error)=>{
                console.log(error);//console.log("Unable to get filtered contents")
                res.status(500).json({message:'Failed to fetch filtered Contents!'})
            });
    })
    .catch((error)=>{
        console.log(error);console.log("Unable to get contentsCount")
        res.status(500).json({message:'Failed to fetch Contents Count!'})
    }); 
}


exports.searchContentName = (req, res, next)=>{

    console.log(req.query)

    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const searchText= req.query.searchtext;
    
console.log(req.query);
console.log(searchText)
        
    let contentQuery=Content.find();
    let fetchedContents;
    
    
    if(searchText ){
        console.log("inside")
        console.log(searchText)
        if(searchText!=""){
        var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
        const CheckValue =new RegExp(regexValue,'i');
       
        contentQuery=Content.find({'name':CheckValue});
        }     
    }

    if(pageSize && currentPage){
        contentQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    contentQuery
        .then(documents=>{
            fetchedContents=documents;
            return Content.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Filtered Content fetched successfully", 
                contents:fetchedContents,
                maxContents:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Filtered Fetching Contents failed!'})
        });    
}


exports.getContentsgroupByLesson=(req, res, next)=>{

    console.log("calling group by")
      
      Content.aggregate([
        {
          $group: {
            _id: '$lessonName',
            count: { $sum: 1 } // this means that the count will increment by 1
          }
        },{ "$sort": { "count": -1 } },
      ]) .then(doc=>{
        console.log(doc)
        res.status(200).json({
            message:"No. of Contents group by lesson fetched successfully", 
            contentsGroupByLesson:doc,
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({message:'Fetching No. of Contents group by lesson failed!'})
    });

}

exports.getContentsListgroupByLesson=(req, res, next)=>{

    Content.aggregate([{$group: { '_id': '$lessonName', contents:{$push:{japanese:"$japanese",eMeaning:"$eMeaning",ePronunciation:"$ePronunciation",tMeaning:"$tMeaning",tPronunciation:"$tPronunciation"}}}}]).then(doc=>{
        console.log(doc)
        res.status(200).json({
            message:"Contents Lit group by lesson fetched successfully", 
            contentsGroupList:doc,
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({message:'Fetching Contents List group by lesson failed!'})
    });

}


exports.getContentsTotalcount=(req, res, next)=>{

    console.log("contents count")

    Content.count().then(totalCount=> { 
        res.status(200).json({
        message:"Total no of Contents fetched successfully", 
        totalContents:totalCount,
    });
})
.catch(error=>{
    console.log(error)
    res.status(500).json({message:'Fetching Total no of Contents failed!'})
});

}

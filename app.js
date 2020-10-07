const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();
mongoose.connect("",{useNewUrlParser:true});

const itemsSchema={
        name:String
};

const Item=mongoose.model("item",itemsSchema);

const item1=new Item({
        name:"Welcome to your todo List"
});

const item2=new Item({
        name:"hit + to add"
});

const item3=new Item({
        name:"<-- hit this to delete"
});

const defaultitems=[item1];



app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.get('/',function (req,res) {
    let today=new Date();
   let options={
           weekday:"long",
           day:'numeric',
           month:'long'
   }
   var day=today.toLocaleDateString('en-US',options);
   Item.find({},function(err,foundItems){
           if(foundItems.length===0){
                Item.insertMany(defaultitems,function(err){
                        console.log("Done");
                });
                res.redirect("/");
           }
           else{
        res.render('list',{
                listTitle:day,
                newListItems:foundItems
            });
            
        }
   });
    
    
});

app.get('/work',function(req,res){
        res.render('list',
        {listTitle:'Work List',
        newListItems:workItems
        })
});



app.post('/',function(req,res){
        let itemName= req.body.newItem;
        const item=new Item({
                name:itemName
        });

        item.save();

        res.redirect("/");
})

app.post("/delete",function(req,res){
        const checkedItemId=req.body.checkbox;
        Item.findByIdAndRemove(checkedItemId,function(err){
                if(!err){
                        console.log("Item Deleted");
                        res.redirect('/');
                }
        })
});

let port=process.env.PORT;
if (port==null||port==""){
        port=3000;
}


app.listen(port,function(){
    console.log('started');
    
})

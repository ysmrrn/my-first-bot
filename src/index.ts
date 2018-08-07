import { Application,Context } from 'probot'
import fs=require("fs-extra");
import  parse from 'csv-parse';

// import { ServerRequest } from 'http';

export = (app: Application) => {+
  // Your code here
  app.log('Yay, the app was loaded!')

  async function reply_from_bot_repo(context: Context){
    //interface test{[key:number]:number;}

    //const hash:test={}
    var hash=[{'id':100000,'cos':0}];
    const reply= fs.readFileSync("csv_result-china.csv","utf8");
    
    const csvContents=parse(reply,{columns:['id','ID','AFP','Input','Output','Enquiry','File','Interface','Added','Changed','Deleted','PDR_AFP','PDR_UFP','NPDR_AFP','NPDU_UFP','Resource','Dev.Type','Duration','N_effort','Effort']});
    
    const reply2= fs.readFileSync("csv_result-china.csv","utf8");
    
    const csvContents2=parse(reply2,{columns:['id','ID','AFP','Input','Output','Enquiry','File','Interface','Added','Changed','Deleted','PDR_AFP','PDR_UFP','NPDR_AFP','NPDU_UFP','Resource','Dev.Type','Duration','N_effort','Effort']});
    

const issue=(await context.github.issues.get(context.issue())).data;
const issuedescription=issue.body;

    let record;
    let message="ID,cos\n";
    let count=0;
    let cos;
    let a;
    let b;
    let naiseki;

    message+=`${issuedescription},\n`;
    
  //  let ID1=1;
    let AFP1=1587;
    let Input1=774;
    let Output1=260;
    let Enquiry1=340;
  
    csvContents.on("readable",()=>{
      

      while(record=csvContents.read()){
        if(parseInt(record.ID)==parseInt(issuedescription)){

    //  let ID2=parseInt(record.ID);
       AFP1=parseInt(record.AFP);
       Input1=parseInt(record.Input);
       Output1=parseInt(record.Output);
       Enquiry1=parseInt(record.Enquiry);

        }
    

      }
    });
    // csvContents.on("end",()=>{
    //     const params=context.issue({body:message});
    //     context.github.issues.createComment(params);
    // });
    csvContents.on("end",()=>{
    csvContents2.on("readable",()=>{


      while(record=csvContents2.read()){
        if((count>=1)&&(parseInt(record.ID)!=parseInt(issuedescription))){
        
         message+=`${parseInt(record.ID)},`;
        // message+=`${parseInt(record.AFP)},`;
        // message+=`${parseInt(record.Input)},`;
        // message+=`${parseInt(record.Output)},`;
        // message+=`${parseInt(record.Enquiry)},`;

      let ID2=parseInt(record.ID);
      let AFP2=parseInt(record.AFP);
      let Input2=parseInt(record.Input);
      let Output2=parseInt(record.Output);
      let Enquiry2=parseInt(record.Enquiry);

        
          
          a=Math.sqrt(AFP1*AFP1+Input1*Input1+Output1*Output1+Enquiry1*Enquiry1);
          b=Math.sqrt(AFP2*AFP2+Input2*Input2+Output2*Output2+Enquiry2*Enquiry2);

          naiseki=AFP1*AFP2+Input1*Input2+Output1*Output2+Enquiry1*Enquiry2;
          cos=naiseki/(a*b);

          // message+=`${naiseki},`;
          // message+=`${a},`;
          // message+=`${b},`;
          message+=`${cos},\n`;

          //hash['ID']=ID2;
          //hash[ID2]=cos;
          hash.push({'id':ID2,'cos':cos});

        }
        count++;

      }
    });
    csvContents2.on("end",()=>{

      hash.sort(function(a,b){
        if(a.cos>b.cos)return -1;
        if(a.cos<b.cos)return 1;
        return 0;

      });

let i;
message="";

message+="|順位|ID| cos類似度 | \n|:-----------|------------:|:------------:|\n"

let a;
      for(i=0;i<10;i++){
        a=Math.round(hash[i].cos*10000)/10000;
        message+=`|${i+1}|${hash[i].id}|${a}|\n`;
      }

      
        a=Math.round(hash[497].cos*10000)/10000;
        message+=`|最下位|${hash[497].id}|${a}|\n\n`;


       
      message+=`ID${parseInt(issuedescription)}と最も似ているプロジェクトはID${hash[0].id}です。`;


        const params=context.issue({body:message});
        context.github.issues.createComment(params);
    });
  });
    //const params =context.issue({body: reply});

    //context.github.issues.createComment(params);

  }


  app.on("issues.opened",reply_from_bot_repo);
}

trigger mergeTriggerOnContact on Contact (After insert) 
{
    if(Trigger.isInsert)
    {
        set<String> Set1=new set<String>();
        set<String> Set2=new set<String>();
        //List<ID>= Idd=new List<ID>();
        for(Contact con:Trigger.new)
        {
            set1.add(con.FirstName);
            set2.add(con.Phone);
        }
        System.debug(' First Name Set Value In Trigger'+set1);
        System.debug('Phone Set Value In Trigger'+set2);
        //System.enqueueJob(new QueueableClassForDublicate (set1,set2));\
        ID jobID =Database.ExecuteBatch(new BatchClass2(set1,set2),50);
        
    }
}
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: { companionId: string } }
  ) {
    try{
    const companiondId = params.companionId ;
    const body = await request.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } =body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!src || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    };


    const companion = await prismadb.companion.update({
        where : {
            id : companiondId
        },
        data : {src, name, description, instructions, seed, categoryId 

        }
    })
    return NextResponse.json(companion);

} catch (error) {
    console.log("[COMPANION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
  }


  export async function DELETE(
    request: Request,
    { params }: { params: { companionId: string } }
  ) {
    try{
    const companiondId = params.companionId ;
   
    const user = await currentUser();
    if(!user){
      return new NextResponse("Not Authenticated" , {status : 401})
    }
const res =  await prismadb.companion.delete({
  where:{
    userId: user.id ,
    id: companiondId,
  }
})
  

    return NextResponse.json({
      message : "Deleted Successfully"
    },{status:201});

} catch (error) {
    console.log("[COMPANION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
  }
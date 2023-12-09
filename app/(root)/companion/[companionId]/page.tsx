import { CompanionForm } from '@/components/companion-form'
import prismadb from '@/lib/prismadb'
import React from 'react'

const PAge = async ({params : { companionId}}:{ params: { companionId: string } }) => {
const categories = await prismadb.category.findMany();
let companion = null;
if(companionId!== 'new'){
   companion = await prismadb.companion.findUnique({
    where : {
      id : companionId
    }
  })

}
  return (
    <CompanionForm initialData={companion } categories={categories}></CompanionForm>
  )
}

export default PAge
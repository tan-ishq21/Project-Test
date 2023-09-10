import {format} from "date-fns";

import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async({
    params
}: {
    params: {storeId: string}
}) => {

    const orders = await prismadb.order.findMany({
        where:{
            storeId: params.storeId
        },
        include:{
            orderitems:{
                include:{
                    product: true
                }
            }
        },
        orderBy:{
            createdAt: 'desc'
        }
    });

    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderitems.map((orderItem) => orderItem.product.name).join(', '),
        totalPrice: formatter.format(item.orderitems.reduce((total,item) => {
            return total + Number(item.product.price)
        },0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, "MMMM dd, yyyy")
    }))

    return (
        <div className="flec-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data = {formattedOrders}/>
            </div>
        </div>
    )
}
export default OrdersPage;
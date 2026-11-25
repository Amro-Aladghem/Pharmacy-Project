import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";



export function OrderProducts({items,total,subPrice,deliveryFees,serviceFees})
{
    
    const OrderItems = items.map((item,index)=>{

        return  <Box className="order-detail-item" sx={{
                        display:'flex',
                        flexDirection:'column',
                        gap:'5px',
                        borderBottom:'1px solid gray'
                    }}
                    key={index}
                    >
                        <Typography level="title-lg">
                           {item.name}
                        </Typography>
                        <Typography level='body-sm'>
                            الكمية : {item.quantity}
                        </Typography>
                        <Typography className="order-detail-value" level='title-lg' sx={{marginRight:'auto'}}>
                            {item.price} jd
                        </Typography>
                    </Box>
    });


    return (
          <Box sx={{
            width:'100%',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            marginTop:'25px'
            }}>
                <Box className="order-details-card" sx={{
                    width:'min(90%, 1100px)',
                    padding:'clamp(16px, 3vw, 24px)',
                    direction:'rtl',
                    textAlign:'right'
                }}
                >
                  <Typography level="h4">
                    طلبك
                  </Typography>  

                  <Box sx={{
                    display:'flex',
                    flexDirection:'column',
                    marginTop:'5px'
                  }}>

                    {OrderItems}

                    <Box sx={{
                        display:'flex',
                        marginTop:'25px'
                    }}>
                        <Typography level="title-lg">
                            سعر المنتجات:
                        </Typography>
                        <Typography className="order-detail-value" level="title-md" sx={{marginRight:'auto'}}>
                            {subPrice} jd
                        </Typography>
                    </Box>

                    <Box sx={{
                        display:'flex',
                        marginTop:'8px'
                    }}>
                        <Typography level="title-lg">
                            سعر التوصيل:
                        </Typography>
                        <Typography className="order-detail-value" level="title-md" sx={{marginRight:'auto'}}>
                            {deliveryFees} jd
                        </Typography>
                    </Box>

                    <Box sx={{
                        display:'flex',
                        marginTop:'8px',
                        borderBottom:'1px solid gray'
                    }}>
                        <Typography level="title-lg">
                            سعر الخدمة :
                        </Typography>
                        <Typography className="order-detail-value" level="title-md" sx={{marginRight:'auto'}}>
                            {serviceFees} jd
                        </Typography>
                    </Box>

                    <Box sx={{
                        display:'flex',
                        marginTop:'8px'
                    }}>
                        <Typography level="title-lg">
                            الأجمالي:
                        </Typography>
                        <Typography className="order-detail-value" level="title-lg" sx={{marginRight:'auto',backgroundColor:'rgba(8, 176, 176, 0.12)'}}>
                            {total} jd
                        </Typography>
                    </Box>

                  </Box>


                </Box>    
          </Box>
    );
}

export default OrderProducts;

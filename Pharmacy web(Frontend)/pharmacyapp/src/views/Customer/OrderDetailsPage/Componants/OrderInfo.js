import Typography from "@mui/joy/Typography";
import { Box } from "@mui/material";
import Chip from '@mui/material/Chip';

export function OrderInfo({orderId,statusName,date})
{
    return (
        <>
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
                <Typography level='h4'>
                  معلومات الطلب
                </Typography>

                <Box className="order-details-fields" sx={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:{xs:'normal',md:'center'},
                    marginTop:'5px',
                    flexDirection:{xs:'column',md:'row'}
                }}>
                    <Box className="order-details-field" sx={{display:{xs:'flex',md:'block'},marginTop:'4px'}}>
                        <Typography level='body-md' >
                           رقم الطلب:
                        </Typography>
                        <Typography className="order-detail-value" level='body-lg'>
                          #{orderId}
                        </Typography>
                    </Box>
                    <Box className="order-details-field" sx={{display:{xs:'flex',md:'block'},marginTop:'4px'}}>
                        <Typography level='body-md'>
                           تاريخ الطلب:
                        </Typography>
                        <Typography className="order-detail-value" level='body-lg'>
                          {date}
                        </Typography>
                    </Box>
                    <Box className="order-details-field" sx={{display:{xs:'flex',md:'block'},marginTop:'4px'}}>
                        <Typography level='body-md'>
                           حالة الطلب:
                        </Typography>
                        <Chip color="primary" label={statusName}/>
                    </Box>

                </Box>
            </Box>

        </Box>



        
        
        
        </>
    );
}

export default OrderInfo;

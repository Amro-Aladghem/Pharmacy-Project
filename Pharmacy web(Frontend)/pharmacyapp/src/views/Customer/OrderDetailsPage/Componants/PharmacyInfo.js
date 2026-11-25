import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";



export function PharmacyInfo({phName,phone,phId})
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

                <Typography level="h4">
                   معلومات الصيدلية
                </Typography>

                <Box className="order-details-fields" sx={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:{xs:'normal',md:'center'},
                    marginTop:'5px',
                    flexDirection:{xs:'column',md:'row'}
                }}>
                    <Box className="order-details-field" sx={{display:{xs:'flex',md:'block'},marginTop:'4px',gap:'3px'}}>
                        <Typography level='body-md' >
                             اسم الصيدلية:
                        </Typography>
                        <Typography level='body-lg'>
                            {phName}
                        </Typography>
                    </Box>
                    <Box className="order-details-field" sx={{display:{xs:'flex',md:'block'},marginTop:'4px',gap:'3px'}}>
                        <Typography level='body-md'>
                            رمز الصيدلية:
                        </Typography>
                        <Typography className="order-detail-value" level='body-lg'>
                            {phId}
                        </Typography>
                    </Box>
                    <Box className="order-details-field" sx={{display:{xs:'flex',md:'block'},marginTop:'4px',gap:'3px'}}>
                        <Typography level='body-md'>
                            رقم الهاتف:
                        </Typography>
                        <Typography className="order-detail-value" level='body-lg'>
                            {phone}
                        </Typography>
                    </Box>
                
                </Box>
            </Box>

            </Box>    

        </>
    );
}

export default PharmacyInfo;

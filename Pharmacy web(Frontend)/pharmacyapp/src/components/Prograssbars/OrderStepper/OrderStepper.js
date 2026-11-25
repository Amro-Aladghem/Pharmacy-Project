import './OrderStepper.css';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import { Stepper, Step, StepLabel } from "@mui/material";

const steps = ['تم الأرسال بنجاح', 'انتظار', 'يتم تجهيز الطلب','توصيل','تم الأستلام'];

const StatusIdToStepsIndex = {
    1:0,
    2:1,
    3:2,
    4:3,
    7:4
}

export function OrderStepper({statusId})
{

    return (
        <>
          <Box className="order-status-wrapper" sx={{
            width:'100%',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            marginTop:'25px'
          }}>
            <Box className="order-status-card" sx={{
                width:'90%',
                maxWidth: 1120,
                minWidth: 0,
                padding:'clamp(16px, 3vw, 26px)',
                boxShadow:'0 5px 20px rgba(27, 39, 51, 0.06)',
                borderRadius:'18px',
                border:'1px solid #e7eaee',
                backgroundColor: 'white',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}>
                    <Typography level='h4' sx={{direction:'rtl', textAlign:'right', marginBottom: 2}}>
                        حالة الطلب
                    </Typography>

                    <Box sx={{
                        display:'flex',
                        justifyContent:'center',
                        width:'100%'
                    }}>
                        <Box className="order-status-desktop" sx={{ width: '100%', minWidth: 0, display:{xs:'none',md:'block'} }}>
                            <Stepper nonLinear activeStep={StatusIdToStepsIndex[statusId]} alternativeLabel sx={{direction:'rtl', width:'100%'}}>
                                {steps.map((label, index) => (
                                <Step key={label} completed={index <= StatusIdToStepsIndex[statusId]} >
                                    <StepLabel
                                        sx={{
                                            '& .MuiStepIcon-root': {
                                                color: '#e6e9ec',
                                                border:'1px solid #cbd2d8',
                                                borderRadius:'50%',
                                            },
                                            '& .Mui-completed .MuiStepIcon-root': {
                                                color: 'rgb(8, 176, 176)',
                                                border:'1px solid rgb(8, 176, 176)',
                                                borderRadius:'50%',
                                                fontWeight: 'bold'
                                            },
                                            '& .Mui-active .MuiStepIcon-root': {
                                                color: 'rgb(255, 86, 114)',
                                                border:'1px solid rgb(255, 86, 114)',
                                            },
                                            '& .MuiStepLabel-label': {
                                                fontWeight: 'bold',
                                                fontSize: 'clamp(13px, 1.2vw, 16px)',
                                                lineHeight: 1.4,
                                                whiteSpace: 'normal',
                                                textAlign: 'center',
                                            },
                                        }}
                                        >
                                        {label}
                                    </StepLabel>
                                </Step>
                                ))}
                            </Stepper>
                        </Box>

                        <Box className="order-status-mobile" sx={{ width:'100%', maxWidth:'none', minWidth:0, display:{xs:'block',md:'none'},direction:'rtl' }}>
                            <Stepper activeStep={StatusIdToStepsIndex[statusId]} orientation="vertical" sx={{direction:'rtl'}}>
                                {steps.map((label, index) => (
                                <Step key={label} completed={index <= StatusIdToStepsIndex[statusId]}>
                                    <StepLabel
                                        sx={{
                                            '& .MuiStepIcon-root': {
                                                color: '#e6e9ec',
                                                fontWeight: 'bold',
                                                border:'1px solid #cbd2d8',
                                                borderRadius:'50%',
                                            },
                                            '& .Mui-completed .MuiStepIcon-root': {
                                                color: 'rgb(8, 176, 176)',
                                                border:'1px solid rgb(8, 176, 176)',
                                                borderRadius:'50%',
                                                fontWeight: 'bold'
                                            },
                                            '& .Mui-active .MuiStepIcon-root': {
                                                color: 'rgb(255, 86, 114)',
                                                border:'1px solid rgb(255, 86, 114)',
                                            },
                                            '& .MuiStepLabel-label': {
                                                fontWeight: 'bolder',
                                                fontSize: '15px',
                                                lineHeight: 1.4,
                                                whiteSpace: 'normal',
                                            },
                                        }}
                                        >
                                        {label}
                                    </StepLabel>
                                </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Box>
            </Box> 
          </Box> 

        </>    

    );
}


export default OrderStepper;

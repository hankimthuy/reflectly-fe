import React from 'react';
import './Homepage.scss'; // Import the SCSS file for styling

import DailyReflectionCard from './DailyReflectionCard/DailyReflectionCard';
import BaseCard from "../../components/common/BaseCard/BaseCard.tsx";
import {IconWrapper} from "../../components/common/IconWrapper/IconWrapper.tsx";
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const HomePage: React.FC = () => {

    return (
                <main className="main-content">
                    <DailyReflectionCard />

                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <BaseCard>
                                <div className="card-header">
                                    <IconWrapper variant="secondary">
                                        <EmojiEmotionsOutlinedIcon />
                                    </IconWrapper>
                                    <div>
                                        <Typography variant="subtitle1" component="div">
                                            Mood Check
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {`"Track your daily emotions"`}
                                        </Typography>
                                    </div>
                                </div>
                            </BaseCard>
                        </Grid>

                        <Grid size={6}>
                            <BaseCard>
                                <div className="card-header">
                                    <IconWrapper variant="primary">
                                        <StarBorderOutlinedIcon />
                                    </IconWrapper>
                                    <div>
                                        <Typography variant="subtitle1" component="div">
                                            Gratitude
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {`"Three things you're grateful for"`}
                                        </Typography>
                                    </div>
                                </div>
                            </BaseCard>
                        </Grid>

                        <Grid size={12}>
                            <BaseCard>
                                <div className="card-header">
                                    <IconWrapper variant="secondary">
                                        <SentimentSatisfiedOutlinedIcon />
                                    </IconWrapper>
                                    <div>
                                        <Typography variant="subtitle1" component="div">
                                            Latest Check-in
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Yesterday: {`"Feeling grateful for the little things in life."`}
                                        </Typography>
                                    </div>
                                </div>
                            </BaseCard>
                        </Grid>
                    </Grid>

                    {/* --- Daily Affirmation BaseCard --- */}
                    <BaseCard>
                        <div className="card-header">
                            <IconWrapper variant="primary">
                                <StarBorderOutlinedIcon />
                            </IconWrapper>
                            <div>
                                <Typography variant="subtitle1" component="div">
                                    Daily Affirmation
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {`"I am worthy of love and happiness."`}
                                </Typography>
                            </div>
                        </div>
                    </BaseCard>
                </main>

    );
};

export default HomePage;
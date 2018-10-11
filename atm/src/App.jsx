import React, { Component } from 'react';

import { Grid, Typography, withStyles, Paper, Button, TextField, List, ListItem, ListItemText } from '@material-ui/core';

import i18n from 'i18next';

const styles = theme => ({
    root: {

    },
    paper: {
        width: '500px',
        height: '500px',
        backgroundColor: 'lightblue'
    },
    screen: {
        width: '500px',
        height: '500px'
    },
    error: {
        color: 'red'
    }
})

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: 1000,
            pin: '1234',
            auth: false,
            pinTries: 0,
            blocked: false,
            currentScreen: 'start',
            screen: '',
            // selectedBalance: '',
            loginNoCard: 'alistair',
            selectedWithdraw: '',
            selectedPin: '',
            selectedCurrentPin: '',
            selectedNewPin: '',
            selectedLoginNoCard: '',
            language: 'en',
            error: ''
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log(prevState.auth !== this.state.auth)
        // console.log(this.state.language)
        if (prevState.auth !== this.state.auth && !this.state.auth) {
            this.setState({ screen: this.props.t('screens').welcome })
        }
        if (prevState.language !== this.state.language) {
            i18n.changeLanguage(this.state.language)
            this.forceUpdate()
        }
    }

    componentDidMount() {
        console.log(this.props.t('inputs').selectPin)
        console.log(i18n.language)
    }

    handleChange = name => event => {
        console.log(name, event.target.value)
        this.setState(({
            [name]: event.target.value,
        }));
    };

    onSubmit = ev => {
        ev.preventDefault()
        const name = ev.target.name
        // console.log(this.state[name])
        // name === 'selectedWithdraw' && 
        switch (name) {
            case 'selectedWithdraw':
                if (this.state.selectedWithdraw <= this.state.balance) {
                    this.setState(prevState => ({ ...prevState, balance: prevState.balance - this.state[name], message2: `${this.props.t('message2').debited} ${this.state[name]}`, selectedWithdraw: '' }))
                } else {
                    this.setState(prevState => ({ ...prevState, error: this.props.t('errors').invalidWithdraw }))
                }
                break;

            case 'selectedPin':
                if (this.state.selectedPin !== '') {

                    if (this.state.selectedPin === this.state.pin) {
                        this.setState({ auth: true, currentScreen: 'start', screen: this.props.t('screens').welcome, selectedPin: '', error: '', pinTries: 0 })
                    } else if (this.state.selectedPin !== this.state.pin) {
                        this.setState(prevState => ({ ...prevState, selectedPin: '', pinTries: prevState.pinTries + 1, error: prevState.pinTries >= 2 ? 'Blocked input, please login without card using your first name' : 'Wrong Pin.', blocked: prevState.pinTries >= 2 }))
                    }
                }
                break;

            case 'selectedLoginNoCard':
                if (this.state.selectedLoginNoCard !== '' && this.state.loginNoCard === this.state.selectedLoginNoCard) {
                    this.setState({ auth: true, blocked: false, selectedLoginNoCard: '', error: '', screen: this.props.t('screens').welcome, selectedPin: '', pinTries: 0 });
                    this.actions.withdraw.showWithdraw()

                } else {
                    this.setState(prevState => ({ ...prevState, selectedLoginNoCard: '', error: prevState.pinTries >= 2 ? 'Blocked input, please login without card using your first name' : 'Wrong Pin.' }))
                }
                break;

            case 'changePin':
                if (this.state.selectedCurrentPin === this.state.pin && this.state.selectedNewPin !== this.state.pin) {
                    this.setState(prevState => ({ ...prevState, pin: this.state.selectedNewPin, message2: 'Pin changed correctly', error: '' }))
                } else if (this.state.selectedCurrentPin === '' || this.state.selectedNewPin === '') {
                    this.setState({ error: this.props.t('errors').emptyPin, message2: '' })
                } else if (this.state.selectedCurrentPin !== this.state.pin) {
                    this.setState({ error: this.props.t('errors').matchPin, message2: '' })
                } else if (this.state.selectedNewPin === this.state.pin) {
                    this.setState({ error: this.props.t('errors').samePin, message2: '' })
                }

                break;



            default:
                break;
        }
    }

    actions = {
        pin: {
            // setPin: (oldPin, newPin) => {
            //     oldPin === this.state.pin ? (newPin !== this.state.pin ? (this.setState({ pin: newPin })) : this.setState({ error: "Pin can't be the same as before." })) : this.setState({ error: 'Pins do not match.' })
            // },
            // checkPin: (pin) => {
            //     pin === this.state.pin ? this.setState({ auth: true }) : this.setState({ error: 'Wrong Pin.' })
            // }
            showChangePin: () => this.setState({ currentScreen: 'changePin' })
        },
        checkBalance: () => {
            this.setState({ currentScreen: 'balance', screen: `${this.props.t('screens').checkBalance} £ ${this.state.balance}` })
        },
        withdraw: {
            showWithdraw: () => {
                this.setState({ currentScreen: 'withdraw', screen: `${this.props.t('screens').currentBalance} ${this.state.balance}`, message2: '' })
            },
            // withdrawAmount: (amount) => {
            //     amount <= this.state.balance ? this.setState(prevState => ({ ...prevState, balance: prevState.balance - amount })) : this.setState({ error: '' })
            // }
        },
        language: {
            changeLanguage: (language) => { this.setState({ language: language }) },
            showChangeLanguage: () => { this.setState({ currentScreen: 'changeLanguage', message2: this.props.t('message2').chooseLanguage }) },
        },

        logout: () => { this.setState({ auth: false }) }
    }

    render() {
        const { classes, t } = this.props;
        const { language } = this.state;
        return (
            <Grid container item xs={12} justify='center' alignItems='center' >
                <Grid item xs={12}>
                    <Typography variant='title' align='center'>
                        {t('screens').atm}
                    </Typography>
                </Grid>
                <Grid container item xs={10} justify='center'>
                    <Grid container item xs justify='center' alignItems='center'>
                        {this.state.auth ?
                            <>
                                <Grid container item xs={2} direction='column' justify='flex-end'>
                                    <Grid container justify='flex-end'>
                                        <Button variant='raised' onClick={() => this.actions.checkBalance()}>
                                            {t('buttons').checkBalance}
                                        </Button>
                                    </Grid>
                                    <Grid container justify='flex-end'>
                                        <Button variant='raised' onClick={() => this.actions.language.showChangeLanguage()}>
                                            {t('buttons').changeLanguage}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                            : null}
                        <Paper className={classes.paper}>
                            {this.state.blocked ?

                                <form name={'selectedLoginNoCard'} onSubmit={this.onSubmit} >
                                    <Grid container alignItems='center' justify='center' className={classes.screen}>

                                        <Grid item xs={12}>
                                            <Typography variant='subheading' align='center' className={classes.error}>
                                                {this.state.error}
                                            </Typography>
                                        </Grid>
                                        <Grid container item xs={12} justify='center'>
                                            <TextField name='selectedLoginNoCard' label={t('inputs').loginNoCard} value={this.state.selectedLoginNoCard} variant='outlined' onChange={this.handleChange('selectedLoginNoCard')} />
                                        </Grid>

                                        <Grid container item xs={12} justify='center'>
                                            <Grid container item xs={6} justify='center'>
                                                <Button variant='raised' type='submit'
                                                // onClick={() => this.actions.withdraw.withdrawAmount(this.state.selectedWithdraw)}
                                                >
                                                    {t('buttons').loginNoCard}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </form>
                                : null}
                            {!this.state.auth && !this.state.blocked ?
                                <Grid container alignItems='center' justify='center' className={classes.screen}>
                                    <Typography variant='title' align='center'>
                                        {this.state.screen}
                                    </Typography>

                                    <form name={'selectedPin'} onSubmit={this.onSubmit} >
                                        <Grid container alignItems='center' justify='center' className={classes.screen}>
                                            <Grid item xs={12}>
                                                <Typography variant='title' align='center'>
                                                    {t('screens').pleaseInputPin}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>

                                                <Typography variant='subheading' align='center' className={classes.error}>
                                                    {this.state.error}
                                                </Typography>
                                            </Grid>

                                            <Grid container item xs={12} justify='center'>
                                                <TextField name='selectedPin' label={t('inputs').selectPin} value={this.state.selectedPin} variant='outlined' onChange={this.handleChange('selectedPin')} />
                                            </Grid>

                                            <Grid container item xs={12} justify='center'>
                                                <Grid container item xs={6} justify='center'>
                                                    <Button variant='raised' type='submit'
                                                    // onClick={() => this.actions.withdraw.withdrawAmount(this.state.selectedWithdraw)}
                                                    >
                                                        {t('buttons').enterPin}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Grid> : null}



                            {this.state.auth ? <>
                                {
                                    this.state.currentScreen === 'start' ?
                                        <Grid container alignItems='center' justify='center' className={classes.screen}>
                                            <Typography variant='title' align='center'>
                                                {this.state.screen}
                                            </Typography>
                                        </Grid> : null
                                }
                                {this.state.currentScreen === 'balance' ?
                                    <Grid container alignItems='center' justify='center' className={classes.screen}>
                                        <Typography variant='title' align='center'>
                                            {this.state.screen}
                                        </Typography>
                                    </Grid> : null}
                                {this.state.currentScreen === 'withdraw' ?
                                    <form name={'selectedWithdraw'} onSubmit={this.onSubmit} >
                                        <Grid container alignItems='center' justify='center' className={classes.screen}>
                                            <Grid item xs={12}>
                                                <Typography variant='title' align='center'>
                                                    {`${t('screens').currentBalance} ${this.state.balance}`}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {this.state.error === '' ?
                                                    <Typography variant='subheading' align='center'>
                                                        {this.state.message2}
                                                    </Typography>
                                                    :
                                                    <Typography variant='subheading' align='center' className={classes.error}>
                                                        {this.state.error}
                                                    </Typography>
                                                }
                                            </Grid>

                                            <Grid container item xs={12} justify='center'>
                                                <Grid container item xs={6} justify='center'>
                                                    <TextField name='selectedWithdraw' label={t('inputs').enterAmount} value={this.state.selectedWithdraw} variant='outlined' onChange={this.handleChange('selectedWithdraw')} />
                                                </Grid>
                                                <Grid container item xs={6} justify='center'>
                                                    <Button variant='raised' type='submit'
                                                    // onClick={() => this.actions.withdraw.withdrawAmount(this.state.selectedWithdraw)}
                                                    >
                                                        {t('buttons').withdraw}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </form>
                                    : null}

                                {this.state.currentScreen === 'changeLanguage' ?
                                    <form name={'selectedWithdraw'} onSubmit={this.onSubmit} >
                                        <Grid container alignItems='center' justify='center' className={classes.screen}>
                                            <Grid item xs={6}>

                                                <Typography variant='title' align='center'>
                                                    {this.state.message2}
                                                </Typography>

                                                <List component="nav">
                                                    <ListItem button selected={language === 'en'} onClick={() => { this.actions.language.changeLanguage('en') }}>
                                                        <ListItemText primary="English" />
                                                    </ListItem>
                                                    <ListItem button selected={language === 'es'} onClick={() => { this.actions.language.changeLanguage('es') }}>
                                                        <ListItemText primary="Español" />
                                                    </ListItem>
                                                    <ListItem button selected={language === 'jp'} onClick={() => { this.actions.language.changeLanguage('jp') }}>
                                                        <ListItemText primary="日本語" />
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                        </Grid>
                                    </form>
                                    : null}


                                {this.state.currentScreen === 'changePin' ?
                                    <form name={'changePin'} onSubmit={this.onSubmit} >
                                        <Grid container alignItems='center' justify='center' className={classes.screen}>
                                            <Grid item xs={12}>
                                                {this.state.error === '' ?
                                                    <Typography variant='subheading' align='center'>
                                                        {this.state.message2}
                                                    </Typography>
                                                    :
                                                    <Typography variant='subheading' align='center' className={classes.error}>
                                                        {this.state.error}
                                                    </Typography>
                                                }
                                            </Grid>

                                            <Grid container item xs={12} justify='center'>
                                                <Grid container item xs={6} justify='center'>
                                                    <TextField name='selectedCurrentPin' label={t('inputs').selectedCurrentPin} value={this.state.selectedCurrentPin} variant='outlined' onChange={this.handleChange('selectedCurrentPin')} />
                                                </Grid>
                                                <Grid container item xs={6} justify='center'>
                                                    <TextField name='selectedNewPin' label={t('inputs').selectedNewPin} value={this.state.selectedNewPin} variant='outlined' onChange={this.handleChange('selectedNewPin')} />
                                                </Grid>
                                                <Grid container item xs={12} justify='center'>
                                                    <Button variant='raised' type='submit'
                                                    // onClick={() => this.actions.withdraw.withdrawAmount(this.state.selectedWithdraw)}
                                                    >
                                                        {t('buttons').changePin}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </form>
                                    : null}
                            </>
                                : null}
                        </Paper>
                        {this.state.auth ?
                            <>
                                <Grid container item xs={2} direction='column' justify='flex-start'>
                                    <Grid>
                                        <Button variant='raised' onClick={() => this.actions.withdraw.showWithdraw()}>
                                            {t('buttons').withdrawCash}
                                        </Button>

                                    </Grid>
                                    <Grid>
                                        <Button variant='raised' onClick={() => this.actions.pin.showChangePin()}>
                                            {t('buttons').changePin}
                                        </Button>

                                    </Grid>
                                    <Grid>
                                        <Button variant='raised' onClick={() => this.actions.logout()}>
                                            {t('buttons').logout}
                                        </Button>

                                    </Grid>
                                </Grid>
                            </>
                            : null}

                    </Grid>
                </Grid>
            </Grid >
        )
    }
}

export default withStyles(styles)(App);
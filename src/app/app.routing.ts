import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router'; 

import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { 
        path: '', 
        component: PagesComponent, children: [
            { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), data: { breadcrumb: 'Home' } },
            { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) , data: { breadcrumb: 'Home' } },
            { path: 'account', loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule), data: { breadcrumb: 'Account Settings' } },
            { path: 'compare', loadChildren: () => import('./pages/compare/compare.module').then(m => m.CompareModule), data: { breadcrumb: 'Compare' } },
            { path: 'wishlist', loadChildren: () => import('./pages/wishlist/wishlist.module').then(m => m.WishlistModule), data: { breadcrumb: 'Wishlist' } },
            { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule), data: { breadcrumb: 'Cart' } },
            { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule), data: { breadcrumb: 'Contact' } },
//            { path: 'sign-in', loadChildren: () => import('./pages/sign-in/sign-in.module').then(m => m.SignInModule), data: { breadcrumb: 'Sign In ' } },
//            { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule), data: { breadcrumb: 'Login ' } },
            { path: 'brands', loadChildren: () => import('./pages/brands/brands.module').then(m => m.BrandsModule), data: { breadcrumb: 'Brands' } },
            { path: 'products', loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule)},
            { path: 'reseller', loadChildren: () => import('./pages/reseller/reseller.module').then(m => m.ResellerModule), data: { breadcrumb: 'Reseller' } },
            { path: 'enquiry', loadChildren: () => import('./pages/enquiry/enquiry.module').then(m => m.EnquiryModule), data: { breadcrumb: 'Enquiry' } },
            { path: 'customisedQuotation', loadChildren: () => import('./pages/customisedQuotation/customisedQuotation.module').then(m => m.CustomisedQuotationModule), data: { breadcrumb: 'Customised Quotation' } },
            { path: 'aboutus', loadChildren: () => import('./pages/aboutUs/aboutUs.module').then(m => m.AboutUsModule), data: { breadcrumb: 'About Us' } },
            { path: 'termsofuse', loadChildren: () => import('./pages/termsOfUse/termsOfUse.module').then(m => m.TermsOfUseModule), data: { breadcrumb: 'Terms Of Use' } },
            { path: 'privacypolicy', loadChildren: () => import('./pages/termsOfUse/termsOfUse.module').then(m => m.TermsOfUseModule), data: { breadcrumb: 'Privacy Policy' } },
            { path: 'refundpolicy', loadChildren: () => import('./pages/refundPolicy/refundPolicy.module').then(m => m.RefundPolicyModule), data: { breadcrumb: 'Refund Policy' } },
        ]
    },
    { path: 'sign-in', loadChildren: () => import('./pages/sign-in/sign-in.module').then(m => m.SignInModule), data: { breadcrumb: 'Sign In ' } },
    { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule), data: { breadcrumb: 'Login ' } },
    { path: 'forgotPassword', loadChildren: () => import('./pages/forgotPass/forgotPass.module').then(m => m.ForgotPassModule), data: { breadcrumb: 'Forgot Password ' } },
//    { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutModule), data: { breadcrumb: 'Checkout' } },
    { path: 'checkout', loadChildren: () => import('./pages/checkoutNew/checkoutNew.module').then(m => m.CheckoutNewModule), data: { breadcrumb: 'Checkout' } },
    { path: 'payment', loadChildren: () => import('./pages/payment/payment.module').then(m => m.PaymentModule), data: { breadcrumb: 'Checkout' } },
    { path: 'confirmOrder', loadChildren: () => import('./pages/confirmOrder/confirm-order.module').then(m => m.ConfirmOrderModule), data: { breadcrumb: 'Checkout' } },
    { path: 'mobilePaymentDetail', loadChildren: () => import('./pages/mobilePaymentDetail/mobilePaymentDetail.module').then(m => m.MobilePaymentDetailModule), data: { breadcrumb: 'Checkout' } },
    { path: 'paymentDetail', loadChildren: () => import('./pages/paymentDetail/paymentDetail.module').then(m => m.PaymentDetailModule), data: { breadcrumb: 'Checkout' } },
    { path: 'paymentDetailNext', loadChildren: () => import('./pages/paymentDetailNext/paymentDetailNext.module').then(m => m.PaymentDetailNextModule), data: { breadcrumb: 'Payment' } },
    { path: 'paymentDetailNextCredit', loadChildren: () => import('./pages/paymentDetailNextCredit/paymentDetailNextCredit.module').then(m => m.PaymentDetailNextCreditModule), data: { breadcrumb: 'Payment' } },
    { path: 'upiPaymentTest', loadChildren: () => import('./pages/upiPaymentTest/upiPaymentTest.module').then(m => m.UpiPaymentTestModule), data: { breadcrumb: 'Payment' } },
    { path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) },
//    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'UploadFile', loadChildren: () => import('./pages/uploadFiles/uploadFiles.module').then(m => m.UploadFilesModule) },
    { path: '**', component: NotFoundComponent },
//    { path: '.well-known/pki-validation/8EEE37BC6204F9AB9855233646775ABF.txt',   redirectTo: '../.well-known/pki-validation/8EEE37BC6204F9AB9855233646775ABF.txt' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
            relativeLinkResolution: 'legacy',
            initialNavigation: 'enabled'  // for one load page, without reload
            // useHash: true
        })
    ],
    exports: [
        RouterModule,
    ]
})
export class AppRoutingModule { }
import React from 'react'

import styled from '@emotion/styled'
import {
  ArrowRight01Icon,
  InstagramIcon,
  PinterestIcon,
  ShoppingBag01Icon,
  TiktokIcon,
} from 'hugeicons-react'

import { BlockRenderer } from '#themes/blocks/BlockRenderer'
import type { SectionComponentProps } from '#themes/types/theme'

export interface FooterSettings {
  brand_name?: string
  description?: string
  shop_links?: string
  help_links?: string
  newsletter_heading?: string
  newsletter_text?: string
  email_placeholder?: string
  copyright_text?: string
  color_scheme?: string
  show_socials?: boolean
  show_payment_methods?: boolean
  padding_top?: number
  padding_bottom?: number
}

const FooterRoot = styled.footer<{ paddingTop: number; paddingBottom: number }>`
  width: 100%;
  padding: ${({ paddingTop, paddingBottom }) =>
    `${paddingTop}px var(--gutter-desktop, 32px) ${paddingBottom}px`};
  color: rgb(var(--color-foreground));
  background: var(--gradient-background, rgb(var(--color-background)));

  @media (max-width: 768px) {
    padding-left: var(--gutter-mobile, 16px);
    padding-right: var(--gutter-mobile, 16px);
  }
`

const FooterInner = styled.div`
  width: 100%;
  max-width: var(--page-width, 1280px);
  margin: 0 auto;
`

const CustomBlocks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding-bottom: 40px;
`

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns:
    minmax(240px, 1.5fr) repeat(2, minmax(130px, 0.7fr))
    minmax(260px, 1.2fr);
  gap: clamp(36px, 6vw, 88px);
  padding-bottom: 56px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 36px;
    padding-bottom: 40px;
  }
`

const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: inherit;
  font-family: var(--font-heading, sans-serif);
  font-size: 23px;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-decoration: none;
`

const BrandMark = styled.span`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(var(--color-foreground), 0.24);
  border-radius: 50%;
  font-size: 17px;
`

const Description = styled.p`
  max-width: 300px;
  margin: 20px 0 0;
  color: rgba(var(--color-foreground), 0.68);
  font-size: 14px;
  line-height: 1.75;
`

const Socials = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`

const SocialLink = styled.a`
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(var(--color-foreground), 0.18);
  border-radius: 50%;
  color: inherit;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    color: rgb(var(--color-background));
    background: rgb(var(--color-foreground));
  }
`

const ColumnTitle = styled.h2`
  margin: 3px 0 19px;
  font-family: var(--font-heading, sans-serif);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const LinkList = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`

const FooterLink = styled.a`
  color: rgba(var(--color-foreground), 0.67);
  font-size: 14px;
  text-decoration: none;

  &:hover {
    color: rgb(var(--color-foreground));
  }
`

const NewsletterText = styled.p`
  margin: -2px 0 19px;
  color: rgba(var(--color-foreground), 0.67);
  font-size: 14px;
  line-height: 1.65;
`

const SignupForm = styled.form`
  display: flex;
  border-bottom: 1px solid rgba(var(--color-foreground), 0.45);
`

const EmailInput = styled.input`
  min-width: 0;
  flex: 1;
  padding: 12px 4px;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  font-size: 14px;

  &::placeholder {
    color: rgba(var(--color-foreground), 0.5);
  }
`

const SubmitButton = styled.button`
  width: 44px;
  border: 0;
  color: inherit;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
`

const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(var(--color-foreground), 0.14);
  color: rgba(var(--color-foreground), 0.56);
  font-size: 12px;

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

const Payments = styled.div`
  display: flex;
  gap: 7px;
`

const Payment = styled.span`
  padding: 4px 7px;
  border: 1px solid rgba(var(--color-foreground), 0.2);
  border-radius: 4px;
  color: rgba(var(--color-foreground), 0.72);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.04em;
`

const parseLinks = (value: string) =>
  value
    .split(',')
    .map((label) => label.trim())
    .filter(Boolean)

export const Footer: React.FC<SectionComponentProps<FooterSettings>> = ({
  id,
  settings,
  blocks = {},
  blockOrder = [],
  isEditor = false,
}) => {
  const {
    brand_name = 'Teras Sapa',
    description = 'Thoughtfully made essentials for slower, more intentional everyday living.',
    shop_links = 'New arrivals, Best sellers, Home & living, Gifts',
    help_links = 'About us, Shipping & returns, FAQs, Contact',
    newsletter_heading = 'Stay in the loop',
    newsletter_text = 'New stories, considered objects, and occasional notes — delivered with care.',
    email_placeholder = 'Your email address',
    copyright_text = '© 2026 Teras Sapa. All rights reserved.',
    color_scheme = 'scheme-4',
    show_socials = true,
    show_payment_methods = true,
    padding_top = 72,
    padding_bottom = 28,
  } = settings

  return (
    <FooterRoot
      className={`color-${color_scheme} gradient`}
      data-color-scheme={color_scheme}
      paddingTop={padding_top}
      paddingBottom={padding_bottom}
    >
      <FooterInner>
        {blockOrder.length > 0 && (
          <CustomBlocks>
            {blockOrder.map((blockId) => {
              const block = blocks[blockId]

              return (
                <BlockRenderer
                  block={block}
                  blockId={blockId}
                  isEditor={isEditor}
                  key={blockId}
                  sectionId={id}
                />
              )
            })}
          </CustomBlocks>
        )}

        <FooterGrid>
          <div>
            <Brand href="/">
              <BrandMark aria-hidden="true">
                <ShoppingBag01Icon size={17} />
              </BrandMark>
              {brand_name}
            </Brand>
            <Description>{description}</Description>
            {show_socials && (
              <Socials aria-label="Social media links">
                <SocialLink href="#" aria-label="Instagram">
                  <InstagramIcon aria-hidden="true" size={16} />
                </SocialLink>
                <SocialLink href="#" aria-label="Pinterest">
                  <PinterestIcon aria-hidden="true" size={16} />
                </SocialLink>
                <SocialLink href="#" aria-label="TikTok">
                  <TiktokIcon aria-hidden="true" size={16} />
                </SocialLink>
              </Socials>
            )}
          </div>

          <nav aria-label="Shop">
            <ColumnTitle>Shop</ColumnTitle>
            <LinkList>
              {parseLinks(shop_links).map((label) => (
                <li key={label}>
                  <FooterLink href="#">{label}</FooterLink>
                </li>
              ))}
            </LinkList>
          </nav>

          <nav aria-label="Help">
            <ColumnTitle>Help</ColumnTitle>
            <LinkList>
              {parseLinks(help_links).map((label) => (
                <li key={label}>
                  <FooterLink href="#">{label}</FooterLink>
                </li>
              ))}
            </LinkList>
          </nav>

          <div>
            <ColumnTitle>{newsletter_heading}</ColumnTitle>
            <NewsletterText>{newsletter_text}</NewsletterText>
            <SignupForm onSubmit={(event) => event.preventDefault()}>
              <EmailInput
                type="email"
                placeholder={email_placeholder}
                aria-label="Email address"
              />
              <SubmitButton type="submit" aria-label="Subscribe">
                <ArrowRight01Icon aria-hidden="true" size={20} />
              </SubmitButton>
            </SignupForm>
          </div>
        </FooterGrid>

        <FooterBottom>
          <span>{copyright_text}</span>
          {show_payment_methods && (
            <Payments aria-label="Accepted payment methods">
              <Payment>VISA</Payment>
              <Payment>MC</Payment>
              <Payment>AMEX</Payment>
              <Payment>PAY</Payment>
            </Payments>
          )}
        </FooterBottom>
      </FooterInner>
    </FooterRoot>
  )
}

Footer.displayName = 'Footer'

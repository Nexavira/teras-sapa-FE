import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface ContactInfoSettings {
  address?: string
  phone?: string
  email?: string
}

const Wrapper = styled.div`
  font-size: clamp(17px, 1.7vw, 22px);
  line-height: 1.55;
  letter-spacing: -0.02em;
  color: inherit;
  white-space: pre-line;

  .meta-lines {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    a {
      color: inherit;
      text-decoration: none;
      transition: color 200ms ease;

      &:hover {
        color: var(--forge-orange);
      }
    }
  }
`

export const ContactInfoBlock: React.FC<
  BlockComponentProps<ContactInfoSettings>
> = ({ settings }) => {
  const {
    address = 'Jl. Industri Selatan 18\nBandung, West Java 40286',
    phone = '+62 22 555 0187',
    email = 'projects@atlas-industries.com',
  } = settings

  return (
    <Wrapper>
      <div>{address}</div>
      <div className="meta-lines">
        {phone && <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>}
        {email && <a href={`mailto:${email}`}>{email}</a>}
      </div>
    </Wrapper>
  )
}

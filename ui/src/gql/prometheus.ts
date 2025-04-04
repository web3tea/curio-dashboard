import { gql } from '@apollo/client'

export const PrometheusQueryRange = gql`
    query PrometheusQueryRange($query: String!, $start: Time!, $end: Time!, $step: Int!) {
      prometheusQueryRange(query: $query, start: $start, end: $end, step: $step) {
        data
      }
  }`

export const PrometheusQuery = gql`
    query PrometheusQuery($query: String!, $time: Time) {
      prometheusQuery(query: $query, time: $time) {
        data
      }
  }`

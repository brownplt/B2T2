# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'

# rubocop:disable RSpec/DescribeClass
# rubocop:disable Metrics/BlockLength

# jellyAnon: a jelly bean table that contains only boolean data
RSpec.describe 'brown jelly beans' do
  include Basics

  describe 'returns a table with only brown jelly beans' do
    let(:raw_table_string) do
      "
      # | get acne | red   | black | white | green | yellow | brown | orange | pink  | purple |
      # | -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ |
      # | true     | false | false | false | true  | false  | false | true   | false | false  |
      # | true     | false | true  | false | true  | true   | false | false  | false | false  |
      # | false    | false | false | false | true  | false  | false | false  | true  | false  |
      # | false    | false | false | false | false | true   | false | false  | false | false  |
      # | false    | false | false | false | false | true   | false | false  | true  | false  |
      # | true     | false | true  | false | false | false  | false | true   | true  | false  |
      # | false    | false | true  | false | false | false  | false | false  | true  | false  |
      # | true     | false | false | false | false | false  | true  | true   | false | false  |
      # | true     | false | false | false | false | false  | false | true   | false | false  |
      # | false    | true  | false | false | false | true   | true  | false  | true  | false  |
      "
    end

    let(:table) { TableEncoder.encode(raw_table_string) }

    let(:count_participants) do
      lambda do |t, color|
        Table.tfilter(t) { |r| keep.call(r, color) }.nrows
      end
    end

    # correct version of keep method
    let(:keep) do
      lambda do |row, color|
        get_value(row, color)
      end
    end

    context 'when happy path' do
      context 'when passing a valid column name' do
        it 'returns the correct number of participants' do
          expect(count_participants.call(table, 'get acne')).to eq(5)
          expect(count_participants.call(table, 'red')).to eq(1)
          expect(count_participants.call(table, 'black')).to eq(3)
          expect(count_participants.call(table, 'white')).to eq(0)
          expect(count_participants.call(table, 'green')).to eq(3)
          expect(count_participants.call(table, 'yellow')).to eq(4)
          expect(count_participants.call(table, 'brown')).to eq(2)
          expect(count_participants.call(table, 'orange')).to eq(4)
          expect(count_participants.call(table, 'pink')).to eq(5)
          expect(count_participants.call(table, 'purple')).to eq(0)
        end
      end
    end

    context 'when unhappy path' do
      context 'when passing a non-valid column name' do
        it 'fails since "turquoise" is not a valid column name' do
          expect { count_participants.call(table, 'turquoise') }.to raise_error(RequireException)
        end
      end

      context 'when typo in keep function' do
        let(:keep) do
          # disable to keep intent of test
          # rubocop:disable Lint/UnusedBlockArgument
          lambda do |row, color|
            get_value(row, 'color')
          end
          # rubocop:enable Lint/UnusedBlockArgument
        end

        it 'fails since "color" is not a valid column name - user meant to pass variable name' do
          expect { count_participants.call(table, 'brown') }.to raise_error(RequireException)
        end
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
# rubocop:enable Metrics/BlockLength
